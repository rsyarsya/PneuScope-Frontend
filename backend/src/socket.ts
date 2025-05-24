import type { Server as SocketIOServer } from "socket.io"

const setupSocketIO = (io: SocketIOServer): void => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Set up interval to emit simulated audio data
    const interval = setInterval(() => {
      // Generate random audio data between 30-80 dB
      const audioData = Array(5)
        .fill(0)
        .map(() => Math.floor(Math.random() * 50) + 30)

      // Emit audio data to all connected clients
      socket.emit("audio-data", audioData)
    }, 1000)

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
      clearInterval(interval)
    })

    // Handle custom events
    socket.on("start-capture", (data) => {
      console.log("Starting audio capture for patient:", data.patientId)
      // In a real implementation, this would start the actual audio capture
    })

    socket.on("stop-capture", (data) => {
      console.log("Stopping audio capture for patient:", data.patientId)
      // In a real implementation, this would stop the actual audio capture
    })
  })
}

export default setupSocketIO
