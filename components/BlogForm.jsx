'use client';

import { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';   // still used for categories lookup
import ImagePreview from './ImagePreview';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Dynamically import Jodit editor to prevent SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// Initialize Gemini client (frontend)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function BlogForm({ categories, onSubmit, submitButtonText, initialData }) {
  const editor = useRef(null);
  let username = Cookies.get('username') || 'Admin';
  if (username && typeof username === 'string') {
    username = username.charAt(0).toUpperCase() + username.slice(1);
  }

  const [formData, setFormData] = useState({
    title:      initialData?.title      || '',
    categoryId: initialData?.categoryId || '',
    excerpt:    initialData?.excerpt    || '',
    content:    initialData?.content    || '',
    thumbnail:  initialData?.thumbnail  || '',
    createdBy:  initialData?.createdBy || username,
    published:  initialData?.published  ?? false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);

  // Jodit configuration
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing your content...',
      height: 400,
      buttons: [
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'superscript', 'subscript', '|',
        'ul', 'ol', '|',
        'outdent', 'indent', '|',
        'font', 'fontsize', 'brush', 'paragraph', '|',
        'image', 'video', 'table', 'link', '|',
        'left', 'center', 'right', 'justify', '|',
        'undo', 'redo', '|',
        'hr', 'eraser', 'copyformat', '|',
        'symbol', 'fullsize',
        'print', 'about'
      ],
      removeButtons: ['source'],
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      toolbarAdaptive: true,
      toolbarSticky: false,
      style: {
        font: '14px Arial, sans-serif'
      },
      uploader: {
        insertImageAsBase64URI: true,
      },
    }),
    []
  );

  /* Resolve slug ➜ id */
  const handleCategoryChange = async (e) => {
    const slug = e.target.value;
    if (!slug) {
      setFormData((p) => ({ ...p, categoryId: '' }));
      return;
    }
    try {
      const { data } = await api.get(`/categories/slug/${slug}`);
      setFormData((p) => ({ ...p, categoryId: data.id }));
    } catch (err) {
      console.error('Unable to resolve category slug:', err);
    }
  };

  /* Normal input / checkbox handler */
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  // Jodit content change handler
  const handleContent = (html) => setFormData((p) => ({ ...p, content: html }));

  /* ✅ Gemini frontend integration */
  const generateExcerpt = async () => {
    if (!formData.content) return;
    setIsGeneratingExcerpt(true);

    try {
      // Clean HTML → plain text
      const plainText = formData.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log('[Gemini] Input:', plainText);

      // Use Gemini API
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Summarize the following blog post into a short excerpt of about max 20 words:\n\n${plainText}`;

      const result = await model.generateContent(prompt);
      const excerpt = result.response.text().trim();

      console.log('[Gemini] Response:', excerpt);
      setFormData(prev => ({ ...prev, excerpt }));
    } catch (error) {
      console.error('[Gemini] Error generating excerpt:', error);

      // fallback simple excerpt
      const plainText = formData.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const words = plainText.split(' ');
      const excerpt = words.slice(0, 25).join(' ');
      setFormData(prev => ({ ...prev, excerpt }));
    } finally {
      setIsGeneratingExcerpt(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting blog post:', formData);
    try {
      await onSubmit({
        title:      formData.title,
        categoryId: formData.categoryId,
        excerpt:    formData.excerpt,
        content:    formData.content,
        thumbnail:  formData.thumbnail,
        createdBy:  formData.createdBy,
        published:  formData.published,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-4 sm:p-8 rounded-2xl shadow-2xl max-w-full mx-auto border border-blue-50" style={{ fontFamily: 'Inter, Nunito Sans, Lato, sans-serif' }}>
      {/* title */}
      <div>
        <label htmlFor="title" className="block text-base font-semibold text-blue-900 mb-2 tracking-tight">Title *</label>
        <input
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleInput}
          className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg bg-blue-50 placeholder:text-blue-300"
          placeholder="Enter blog title"
        />
      </div>

      {/* category */}
      <div>
        <label htmlFor="category" className="block text-base font-semibold text-blue-900 mb-2 tracking-tight">Category *</label>
        <select
          id="category"
          required
          onChange={handleCategoryChange}
          value={categories.find(c => c.id === formData.categoryId)?.slug || ''}
          className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg bg-blue-50"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* excerpt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
          <button
            type="button"
            onClick={generateExcerpt}
            disabled={isGeneratingExcerpt || !formData.content}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingExcerpt ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Generate with AI
              </>
            )}
          </button>
        </div>
        <textarea
          id="excerpt"
          name="excerpt"
          rows="3"
          value={formData.excerpt}
          onChange={handleInput}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description… or click 'Generate with AI' to auto-generate from content"
        />
        <p className="mt-1 text-xs text-gray-500">
          Recommended: 20-25 words. {formData.excerpt ? `Current: ${formData.excerpt.split(' ').length} words` : ''}
        </p>
      </div>

      {/* content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <JoditEditor
            ref={editor}
            value={formData.content}
            config={config}
            onBlur={handleContent}
            onChange={() => {}}
          />
        </div>
      </div>

      {/* thumbnail */}
      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image URL</label>
        <input
          id="thumbnail"
          name="thumbnail"
          type="url"
          value={formData.thumbnail}
          onChange={handleInput}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        {formData.thumbnail && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <ImagePreview
              imgUrl={formData.thumbnail}
              name="Thumbnail preview"
              size="w-32 h-20"
              shape="rounded-md"
              className="border border-gray-300"
            />
          </div>
        )}
      </div>

      {/* createdBy */}
      <div>
        <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-2">Created By *</label>
        <input
          id="createdBy"
          name="createdBy"
          required
          value={formData.createdBy}
          onChange={handleInput}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* published */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          name="published"
          checked={formData.published}
          onChange={handleInput}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-900">Published</label>
      </div>

      {/* submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
