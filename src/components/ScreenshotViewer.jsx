import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDownload, FaExpand, FaCompress, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const ScreenshotViewer = ({ images = [], initialIndex = 0, onClose = () => {} }) => {
  const [index, setIndex] = useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => setIndex(initialIndex), [initialIndex])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(images.length - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex((i) => Math.min(images.length - 1, i + 1)), [images.length])

  if (!images || images.length === 0) return null

  const current = typeof images[0] === 'string' ? { src: images[index] } : images[index]

  return (
    <AnimatePresence>
      <motion.div
        key="screenshot-viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className={`relative w-full max-w-5xl bg-white rounded-xl p-4 ${isFullscreen ? 'h-screen max-w-none' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{current?.title ?? 'Image'}</h3>
              {current?.transactionDate && (
                <p className="text-sm text-gray-500">{new Date(current.transactionDate).toLocaleString()}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {images.length > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={prev} className="p-2 rounded-md hover:bg-gray-100">
                    <FaChevronLeft />
                  </button>
                  <span className="text-sm text-gray-600">{index + 1}/{images.length}</span>
                  <button onClick={next} className="p-2 rounded-md hover:bg-gray-100">
                    <FaChevronRight />
                  </button>
                </div>
              )}

              {current?.src && (
                <a
                  href={current.src}
                  download
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <FaDownload />
                </a>
              )}

              <button
                onClick={() => setIsFullscreen((s) => !s)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>

              <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
                <FaTimes />
              </button>
            </div>
          </div>

          <div className={`flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden`}>
            <div className={`${isFullscreen ? 'w-1/2 h-[85vh]' : 'w-[300px] h-[300px]'} flex items-center justify-center`}> 
              <img
                src={current.src}
                alt={current?.title ?? 'receipt'}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {current?.paidAmount != null && (
            <div className="mt-4 text-right">
              <div className="text-green-600 font-bold">{current.paidAmount}</div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ScreenshotViewer
