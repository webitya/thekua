'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Toast({ message, isVisible, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <span className="font-medium">{message}</span>
                <button onClick={onClose} className="ml-4 hover:opacity-75">
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
