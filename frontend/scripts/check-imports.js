const fs = require("fs")
const path = require("path")

function findProblematicImports(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      // Skip node_modules
      if (file === "node_modules" || file === ".next") continue
      findProblematicImports(filePath)
    } else if (stats.isFile() && (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js"))) {
      const content = fs.readFileSync(filePath, "utf8")

      // Check for imports from backend
      if (content.includes("../backend") || content.includes("./backend") || content.includes("backend/")) {
        console.log(`Problematic import found in ${filePath}`)

        // Extract the problematic line
        const lines = content.split("\n")
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes("../backend") || lines[i].includes("./backend") || lines[i].includes("backend/")) {
            console.log(`Line ${i + 1}: ${lines[i]}`)
          }
        }
      }
    }
  }
}

// Start from the current directory
findProblematicImports(".")
