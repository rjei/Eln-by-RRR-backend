import sequelize from '../config/db.js';
import GameQuestion from '../models/gameQuestion.model.js';

// Crossword puzzle data - migrated from CrosswordGame.tsx
const crosswordPuzzles = [
    {
        gameType: 'crossword',
        difficulty: 'easy',
        content: {
            gridSize: 7,
            clues: [
                {
                    number: 1,
                    clue: "Opposite of big",
                    answer: "SMALL",
                    direction: "across",
                    startRow: 0,
                    startCol: 0,
                },
                {
                    number: 2,
                    clue: "Color of the sky",
                    answer: "BLUE",
                    direction: "down",
                    startRow: 0,
                    startCol: 0,
                },
                {
                    number: 3,
                    clue: "Fruit that keeps doctor away",
                    answer: "APPLE",
                    direction: "across",
                    startRow: 1,
                    startCol: 1,
                },
                {
                    number: 4,
                    clue: "Frozen water",
                    answer: "ICE",
                    direction: "down",
                    startRow: 1,
                    startCol: 2,
                },
                {
                    number: 5,
                    clue: 'Animal that says "meow"',
                    answer: "CAT",
                    direction: "across",
                    startRow: 2,
                    startCol: 0,
                },
                {
                    number: 6,
                    clue: "Hot drink, often in morning",
                    answer: "TEA",
                    direction: "down",
                    startRow: 0,
                    startCol: 4,
                },
                {
                    number: 7,
                    clue: "Opposite of old",
                    answer: "NEW",
                    direction: "across",
                    startRow: 3,
                    startCol: 2,
                },
                {
                    number: 8,
                    clue: "Red fruit, often in salad",
                    answer: "TOMATO",
                    direction: "down",
                    startRow: 1,
                    startCol: 5,
                },
            ]
        }
    },
    // Second crossword puzzle - Medium difficulty
    {
        gameType: 'crossword',
        difficulty: 'medium',
        content: {
            gridSize: 8,
            clues: [
                {
                    number: 1,
                    clue: "Large body of water",
                    answer: "OCEAN",
                    direction: "across",
                    startRow: 0,
                    startCol: 0,
                },
                {
                    number: 2,
                    clue: "Opposite of day",
                    answer: "NIGHT",
                    direction: "down",
                    startRow: 0,
                    startCol: 0,
                },
                {
                    number: 3,
                    clue: "Yellow fruit, monkeys love it",
                    answer: "BANANA",
                    direction: "across",
                    startRow: 1,
                    startCol: 1,
                },
                {
                    number: 4,
                    clue: "Season after summer",
                    answer: "AUTUMN",
                    direction: "down",
                    startRow: 0,
                    startCol: 3,
                },
                {
                    number: 5,
                    clue: "You read this",
                    answer: "BOOK",
                    direction: "across",
                    startRow: 3,
                    startCol: 0,
                },
                {
                    number: 6,
                    clue: "Planet we live on",
                    answer: "EARTH",
                    direction: "down",
                    startRow: 2,
                    startCol: 2,
                },
                {
                    number: 7,
                    clue: "Building where you learn",
                    answer: "SCHOOL",
                    direction: "across",
                    startRow: 5,
                    startCol: 1,
                },
                {
                    number: 8,
                    clue: "Opposite of slow",
                    answer: "FAST",
                    direction: "down",
                    startRow: 4,
                    startCol: 5,
                },
            ]
        }
    },
    // Third crossword puzzle - Hard difficulty
    {
        gameType: 'crossword',
        difficulty: 'hard',
        content: {
            gridSize: 9,
            clues: [
                {
                    number: 1,
                    clue: "Study of languages",
                    answer: "LINGUISTICS",
                    direction: "across",
                    startRow: 0,
                    startCol: 0,
                },
                {
                    number: 2,
                    clue: "Knowledge gained through study",
                    answer: "LEARNING",
                    direction: "down",
                    startRow: 0,
                    startCol: 0,
                },
                {
                    number: 3,
                    clue: "Ability to speak multiple languages",
                    answer: "FLUENT",
                    direction: "across",
                    startRow: 2,
                    startCol: 1,
                },
                {
                    number: 4,
                    clue: "Words and their meanings",
                    answer: "VOCABULARY",
                    direction: "down",
                    startRow: 1,
                    startCol: 4,
                },
                {
                    number: 5,
                    clue: "Rules of a language",
                    answer: "GRAMMAR",
                    direction: "across",
                    startRow: 4,
                    startCol: 0,
                },
                {
                    number: 6,
                    clue: "Way of speaking",
                    answer: "ACCENT",
                    direction: "down",
                    startRow: 2,
                    startCol: 6,
                },
                {
                    number: 7,
                    clue: "Written works",
                    answer: "PROSE",
                    direction: "across",
                    startRow: 6,
                    startCol: 2,
                },
                {
                    number: 8,
                    clue: "Test of knowledge",
                    answer: "EXAM",
                    direction: "down",
                    startRow: 5,
                    startCol: 3,
                },
            ]
        }
    }
];

async function seedCrossword() {
    try {
        await sequelize.authenticate();
        console.log('Database connected for crossword seeding');

        // Sync the GameQuestion model
        await GameQuestion.sync({ alter: true });
        console.log('GameQuestion table synced');

        // Check if crossword data already exists
        const existingCount = await GameQuestion.count({
            where: { gameType: 'crossword' }
        });

        if (existingCount > 0) {
            console.log(`Crossword data already exists (${existingCount} puzzles). Skipping seed.`);
            console.log('To reseed, delete existing crossword records first.');
            process.exit(0);
        }

        // Insert crossword puzzles
        await GameQuestion.bulkCreate(crosswordPuzzles);
        console.log(`✅ Seeded ${crosswordPuzzles.length} crossword puzzles!`);
        console.log('   - Easy: 1 puzzle');
        console.log('   - Medium: 1 puzzle');
        console.log('   - Hard: 1 puzzle');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding crossword:', error);
        process.exit(1);
    }
}

seedCrossword();
