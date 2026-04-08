"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"

export function TextScramble({ text, className = "" }) {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef(null)
  const frameRef = useRef(0)

  const scramble = useCallback(() => {
    setIsScrambling(true)
    frameRef.current = 0
    const duration = text.length * 3

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      frameRef.current++

      const progress = frameRef.current / duration
      const revealedLength = Math.floor(progress * text.length)

      const newText = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (i < revealedLength) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join("")

      setDisplayText(newText)

      if (frameRef.current >= duration) {
        clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, 30)
  }, [text])

  useEffect(() => {
    const timeout = setTimeout(() => {
      scramble()
    }, 300) // delay in ms
  
    return () => {
      clearTimeout(timeout)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [scramble])

  return (
    <div
      className={`scramble ${className}`}
      onMouseEnter={() => {
        setIsHovering(true)
        scramble()
      }}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className="scramble-text">
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            className={`char ${
              isScrambling && char !== text[i] ? "scramble-active" : ""
            }`}
            style={{ transitionDelay: `${i * 10}ms` }}
          >
            {char}
          </span>
        ))}
      </span>

      <span className={`underline ${isHovering ? "show" : ""}`} />
    </div>
  )
}