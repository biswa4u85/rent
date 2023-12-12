"use client"
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

let socket: any

const Page = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer: any = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', (msg: any) => {
      console.log('msg FF ...', msg)
      setInput(msg)
    })

  }

  const onChangeHandler = (e: any) => {
    setInput(e.target.value)
    console.log('send FF ...', e.target.value)
    socket.emit('input-change', e.target.value)
  }

  return <input
    placeholder="Type something"
    value={input}
    onChange={onChangeHandler}
  />

};

export default Page;