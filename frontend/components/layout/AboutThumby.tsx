"use client";

import { useState } from "react";
import { Info, Check, Clock, X, Image as ImageIcon } from "lucide-react";

export function AboutThumby() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg transition-all"
      >
        <Info className="w-5 h-5" />
        <span className="font-medium text-sm">About Thumby</span>
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          {/* Popup Content */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-orange-600" />
                </div>
                Thumby
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto">
              <p className="text-gray-600 mb-4 leading-relaxed">
                Thumby is an AI platform that helps you browse and generate high-converting YouTube, Instagram, Facebook, TikTok Reels and YouTube Shorts thumbnails. 
              </p>
              <p className="text-gray-600 mb-6">
                This is an early build. Here's exactly what's real right now.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Note:</span> For exploration purposes, some features might be simulated or under active development.
              </div>

              {/* What's Working */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  What's Working
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Normal sign/signup with email working</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Browse trending thumbnails</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Favourites and history tracking</span>
                  </li>
                </ul>
              </div>

              {/* Still Building */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Still Building
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-500">Google Authentication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-500">LLM working for prompt generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-500">Full AI Thumbnail Generation Pipeline</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-500">Advanced editing features</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
