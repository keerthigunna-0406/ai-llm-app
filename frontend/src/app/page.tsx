'use client'

import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponse('')

    if (!prompt.trim()) {
      setResponse("⚠️ Please enter a prompt.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch('https://ai-llm-app.onrender.com/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      setResponse(data.result || data.response || "⚠️ No response returned")
    } catch (error) {
      setResponse('❌ Error: Could not connect to backend.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ask the LLM</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border rounded p-2 bg-white text-black"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Submit'}
        </button>

        {loading && (
          <div className="mt-4 text-sm text-blue-500 animate-pulse">
            ⏳ Generating response...
          </div>
        )}
      </form>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 border rounded">
          <h2 className="font-semibold text-black mb-2">Response:</h2>
          <p className="text-black whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </main>
  )
}