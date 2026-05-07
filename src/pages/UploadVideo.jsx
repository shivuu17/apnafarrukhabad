import { motion } from 'framer-motion'
import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'

function UploadVideo() {
  const { t } = useLanguage()
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    village: '',
    category: '',
  })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile || !formData.title) {
      alert('⚠️ Please select a video and enter a title')
      return
    }

    setUploading(true)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(false)
    setUploadComplete(true)
    
    alert(`🎥 Video "${formData.title}" uploaded successfully!`)
    setTimeout(() => {
      setUploadComplete(false)
      setSelectedFile(null)
      setFormData({ title: '', description: '', village: '', category: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-4">
      <Header scrolled={false} />
      <main className="px-3 pt-6 sm:px-4">
        <div className="mx-auto max-w-2xl">
          <SectionHeader title="Upload Video" subtitle="Document your updates and share with community" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-6"
          >
            {/* Video Preview */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border-2 border-slate-200 bg-slate-900 p-6"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-500" size={24} />
                  <div>
                    <p className="font-bold text-white">File Selected</p>
                    <p className="text-sm text-slate-400">{selectedFile.name}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
              <div className="space-y-4">
                {/* Video File */}
                <div>
                  <label className="block text-sm font-bold text-navy-900">Select Video File</label>
                  <div className="mt-2 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center hover:border-agri-500 transition">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-input"
                    />
                    <label htmlFor="video-input" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={32} className="text-slate-400" />
                        <p className="text-sm font-semibold text-slate-600">
                          {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-slate-500">MP4, WebM up to 500MB</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-navy-900">Video Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter an engaging title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-agri-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-navy-900">Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe your video content"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-agri-500 focus:outline-none"
                  />
                </div>

                {/* Village */}
                <div>
                  <label className="block text-sm font-bold text-navy-900">Village</label>
                  <select
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-agri-500 focus:outline-none"
                  >
                    <option value="">Select your village</option>
                    <option value="farrukhabad">फर्रुखाबाद</option>
                    <option value="khetpur">खेतपुर</option>
                    <option value="nai-basti">नई बस्ती</option>
                    <option value="mohammadpur">मोहम्मदपुर</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-navy-900">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-agri-500 focus:outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="agriculture">कृषि (Agriculture)</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>

              {/* Upload Button */}
              <motion.button
                type="submit"
                disabled={uploading || !selectedFile}
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 font-bold text-white transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : uploadComplete ? (
                  <>
                    <CheckCircle size={20} />
                    Video Uploaded!
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Video
                  </>
                )}
              </motion.button>
            </form>

            {/* Info */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Video Guidelines</p>
                  <ul className="mt-2 text-sm text-blue-800 space-y-1">
                    <li>• Keep videos under 5 minutes</li>
                    <li>• Ensure good video/audio quality</li>
                    <li>• Use titles and descriptions that are clear and helpful</li>
                    <li>• Respect community standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default UploadVideo
