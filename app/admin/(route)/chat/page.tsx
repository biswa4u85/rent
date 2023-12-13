"use client"
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

let socket: any

const Page = () => {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState('')

  useEffect(() => {
    socketInitializer()
    return () => {
      backChat()
    }
  }, [])

  const socketInitializer: any = async () => {
    await fetch('http://localhost:3000/api/socket')
    socket = io()

    // socket.on('connect', () => {
    //   console.log('connected')
    // })

    // socket.on('update-input', (msg: any) => {
    //   console.log('msg FF ...', msg)
    //   setInput(msg)
    // })

    socket.emit('join', "itemId");
    socket.on('sendMessage', (msg: any) => {
      setMessages((prevMessages: any) => [...prevMessages, msg]);
    });

  }

  const backChat = async () => {
    socket.emit('leave', "itemId");
    socket.off('sendMessage');
  }

  const onChangeHandler = () => {
    socket.emit('sendMessage', {
      room: "itemId", message: {
        text: "tt",
        user: "user._id",
        group: "itemId",
      }
    });
  }


  console.log(messages)

  return <h1 onClick={() => onChangeHandler()}>Click</h1>

};

export default Page;