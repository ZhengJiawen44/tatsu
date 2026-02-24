"use client"

import React, { useState } from "react"
import { Copy, Check } from "lucide-react"

function CodeBlock() {
    const [copied, setCopied] = useState(false)

    const command = `docker run -d --name tatsu -p 3000:3000 --env-file .env --restart unless-stopped ghcr.io/zhengjiawen44/tatsu:latest`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(command)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <div className="flex mt-18 bg-black w-fit rounded-lg border border-popover mx-auto">
            <span className=" my-auto mx-3 font-mono! text-sm line-clamp-1" >
                {command}
            </span>

            <button
                onClick={handleCopy}
                className="p-2.5 pr-4 rounded-br-lg rounded-tr-lg border-l bg-popover text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
                {copied ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        </div>
    )
}

export default CodeBlock