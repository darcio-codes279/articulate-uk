"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DogIcon as Animal, Utensils, Film, Dumbbell, Music, Globe } from "lucide-react"
import useSound from "use-sound"
import { Settings } from "@/components/settings"

const categories = {
  animals: {
    icon: Animal,
    words: ["Dog", "Cat", "Elephant", "Giraffe", "Lion", "Tiger", "Monkey", "Zebra", "Kangaroo", "Penguin"],
  },
  food: {
    icon: Utensils,
    words: ["Pizza", "Sushi", "Burger", "Pasta", "Salad", "Ice Cream", "Chocolate", "Banana", "Apple", "Steak"],
  },
  movies: {
    icon: Film,
    words: [
      "Star Wars",
      "Titanic",
      "Avatar",
      "Jurassic Park",
      "The Matrix",
      "Frozen",
      "The Godfather",
      "Avengers",
      "Inception",
      "Toy Story",
    ],
  },
  sports: {
    icon: Dumbbell,
    words: [
      "Football",
      "Basketball",
      "Tennis",
      "Golf",
      "Swimming",
      "Volleyball",
      "Baseball",
      "Soccer",
      "Rugby",
      "Cricket",
    ],
  },
  music: {
    icon: Music,
    words: ["Rock", "Jazz", "Pop", "Classical", "Hip Hop", "Country", "Blues", "Reggae", "Electronic", "Folk"],
  },
  geography: {
    icon: Globe,
    words: ["Mountain", "River", "Ocean", "Desert", "Forest", "Island", "Volcano", "Canyon", "Glacier", "Savanna"],
  },
}

export default function ArticulateGame() {
  const [currentWord, setCurrentWord] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [maxTime, setMaxTime] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showTimerDialog, setShowTimerDialog] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)
  const [maxSkips, setMaxSkips] = useState(3)
  const [remainingSkips, setRemainingSkips] = useState(3)

  const [playCorrect] = useSound("/sounds/correct.mp3")
  const [playPass] = useSound("/sounds/pass.mp3")
  const [playTimeUp] = useSound("/sounds/timeup.mp3")
  const [playSelect] = useSound("/sounds/select.mp3")

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      playTimeUp()
      endGame()
    }
  }, [isPlaying, timeLeft, playTimeUp])

  useEffect(() => {
    if (selectedCategory) {
      setShowTimerDialog(true)
    }
  }, [selectedCategory])

  const startGame = () => {
    setIsPlaying(true)
    setCurrentWord(getRandomWord())
    setTimeLeft(maxTime)
    setScore(0)
    setGameOver(false)
    setShowTimerDialog(false)
    setRemainingSkips(maxSkips)
  }

  const getRandomWord = () => {
    const words = categories[selectedCategory].words
    return words[Math.floor(Math.random() * words.length)]
  }

  const handleCorrect = () => {
    playCorrect()
    setScore(score + 1)
    setCurrentWord(getRandomWord())
  }

  const handlePass = () => {
    if (remainingSkips > 0) {
      playPass()
      setCurrentWord(getRandomWord())
      setRemainingSkips(remainingSkips - 1)
    }
  }

  const endGame = () => {
    setIsPlaying(false)
    setGameOver(true)
  }

  const selectCategory = (category) => {
    playSelect()
    setSelectedCategory(category)
  }

  const resetGame = () => {
    setSelectedCategory("")
    setGameOver(false)
    setScore(0)
    setRemainingSkips(maxSkips)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 flex flex-col items-center justify-center p-4">
      {showTutorial && (
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Play Articulate!</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Choose a category from the grid.</li>
                <li>Set the game duration (10-120 seconds).</li>
                <li>When the game starts, describe the word shown without saying it.</li>
                <li>Tap "Got it!" if guessed correctly, or "Pass" to skip.</li>
                <li>Try to guess as many words as possible before time runs out!</li>
              </ol>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowTutorial(false)}>Got it!</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {!isPlaying && !gameOver && (
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white">Articulate!</h1>
          <div className="absolute top-4 right-4">
            <Settings
              maxSkips={maxSkips}
              onMaxSkipsChange={(value) => {
                setMaxSkips(value)
                setRemainingSkips(value)
              }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
            {Object.entries(categories).map(([category, { icon: Icon }]) => (
              <Card
                key={category}
                className="p-6 cursor-pointer hover:bg-blue-100 transition-colors flex flex-col items-center"
                onClick={() => selectCategory(category)}
              >
                <Icon className="w-12 h-12 mb-2" />
                <h2 className="text-xl font-bold capitalize">{category}</h2>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={showTimerDialog}
        onOpenChange={(open) => {
          setShowTimerDialog(open)
          if (!open) setSelectedCategory("")
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Timer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="timer">Game Duration (seconds)</Label>
            <Input
              id="timer"
              type="number"
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              min="10"
              max="120"
            />
          </div>
          <DialogFooter>
            <Button onClick={startGame} size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500">
              Start Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isPlaying && (
        <div className="w-full max-w-md">
          <div className="mb-4 text-center">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold text-white"
            >
              {timeLeft}
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord}
              initial={{ rotateX: -90 }}
              animate={{ rotateX: 0 }}
              exit={{ rotateX: 90 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 mb-8 shadow-lg"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-center text-blue-600">{currentWord}</h2>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mb-4">
            <Button
              onClick={handlePass}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white text-xl px-8 py-4 w-28"
              disabled={remainingSkips === 0}
            >
              Pass ({remainingSkips})
            </Button>
            <Button
              onClick={handleCorrect}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-4 w-28"
            >
              Got it!
            </Button>
          </div>
          {remainingSkips === 0 && <p className="text-red-300 text-center mt-2">No more skips left!</p>}
          <Button
            onClick={endGame}
            size="lg"
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 text-xl px-8 py-4"
          >
            End Game
          </Button>
        </div>
      )}

      {gameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">Game Over!</h2>
          <p className="text-2xl md:text-4xl mb-8 text-yellow-300">Your Score: {score}</p>
          <Button
            onClick={resetGame}
            size="lg"
            className="bg-yellow-400 text-black hover:bg-yellow-500 text-xl px-8 py-4"
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  )
}

