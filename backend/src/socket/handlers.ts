import type { Server } from "socket.io"

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    // Handle audio capture start
    socket.on("start-capture", (data) => {
      console.log(`🎤 Starting audio capture for patient: ${data.patientId}`)

      // Simulate real-time audio data every second
      const audioInterval = setInterval(() => {
        // Generate simulated chest audio data (decibel levels)
        // In production, this would come from actual hardware sensors
        const simulatedAudioData = generateSimulatedAudioData()
        socket.emit("audio-data", simulatedAudioData)
      }, 1000)

      // Store interval ID for cleanup
      socket.data.audioInterval = audioInterval
    })

    // Handle audio capture stop
    socket.on("stop-capture", () => {
      console.log(`⏹️ Stopping audio capture for client: ${socket.id}`)

      if (socket.data.audioInterval) {
        clearInterval(socket.data.audioInterval)
        delete socket.data.audioInterval
      }
    })

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`)

      // Cleanup any running intervals
      if (socket.data.audioInterval) {
        clearInterval(socket.data.audioInterval)
      }
    })
  })
}

// Simulate chest audio sensor data
function generateSimulatedAudioData(): number[] {
  // Generate 5 data points per second (simulating 5Hz sampling)
  const dataPoints = []

  for (let i = 0; i < 5; i++) {
    // Simulate normal breathing sounds with some variation
    // Normal chest sounds: 20-40 dB
    // Abnormal sounds (wheezing, crackling): 40-80 dB
    const baseLevel = 25 + Math.random() * 15 // 25-40 dB base

    // Add occasional abnormal sounds for demo purposes
    const abnormalChance = Math.random()
    if (abnormalChance < 0.1) {
      // 10% chance of abnormal sound
      dataPoints.push(baseLevel + 20 + Math.random() * 20) // 45-80 dB
    } else {
      dataPoints.push(baseLevel)
    }
  }

  return dataPoints
}
