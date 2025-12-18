import sequelize from '../config/db.js';
import GameQuestion from '../models/gameQuestion.model.js';

// Wordle words (5 letters, English vocabulary)
const wordleQuestions = [
    { gameType: 'wordle', difficulty: 'easy', content: { word: 'APPLE' } },
    { gameType: 'wordle', difficulty: 'easy', content: { word: 'HAPPY' } },
    { gameType: 'wordle', difficulty: 'easy', content: { word: 'HOUSE' } },
    { gameType: 'wordle', difficulty: 'easy', content: { word: 'WATER' } },
    { gameType: 'wordle', difficulty: 'medium', content: { word: 'BRAIN' } },
    { gameType: 'wordle', difficulty: 'medium', content: { word: 'CHAIR' } },
    { gameType: 'wordle', difficulty: 'medium', content: { word: 'DANCE' } },
    { gameType: 'wordle', difficulty: 'medium', content: { word: 'EARTH' } },
    { gameType: 'wordle', difficulty: 'hard', content: { word: 'GHOST' } },
    { gameType: 'wordle', difficulty: 'hard', content: { word: 'JUDGE' } },
    { gameType: 'wordle', difficulty: 'hard', content: { word: 'KNIFE' } },
    { gameType: 'wordle', difficulty: 'hard', content: { word: 'LEMON' } },
    { gameType: 'wordle', difficulty: 'easy', content: { word: 'MUSIC' } },
    { gameType: 'wordle', difficulty: 'easy', content: { word: 'NIGHT' } },
    { gameType: 'wordle', difficulty: 'medium', content: { word: 'OCEAN' } },
];

// Hangman words with clues
const hangmanQuestions = [
    { gameType: 'hangman', difficulty: 'easy', content: { word: 'ELEPHANT', clue: 'Large animal with a long trunk' } },
    { gameType: 'hangman', difficulty: 'easy', content: { word: 'CHOCOLATE', clue: 'Sweet brown candy' } },
    { gameType: 'hangman', difficulty: 'easy', content: { word: 'BUTTERFLY', clue: 'Beautiful flying insect' } },
    { gameType: 'hangman', difficulty: 'medium', content: { word: 'COMPUTER', clue: 'Electronic device for work' } },
    { gameType: 'hangman', difficulty: 'medium', content: { word: 'DICTIONARY', clue: 'Book containing word definitions' } },
    { gameType: 'hangman', difficulty: 'medium', content: { word: 'RESTAURANT', clue: 'Place to eat meals' } },
    { gameType: 'hangman', difficulty: 'hard', content: { word: 'PHOTOGRAPHY', clue: 'Art of taking pictures' } },
    { gameType: 'hangman', difficulty: 'hard', content: { word: 'UNIVERSITY', clue: 'Institution for higher education' } },
    { gameType: 'hangman', difficulty: 'hard', content: { word: 'VOCABULARY', clue: 'Collection of words in a language' } },
    { gameType: 'hangman', difficulty: 'easy', content: { word: 'TELEPHONE', clue: 'Device for calling people' } },
    { gameType: 'hangman', difficulty: 'medium', content: { word: 'ADVENTURE', clue: 'Exciting journey or experience' } },
    { gameType: 'hangman', difficulty: 'medium', content: { word: 'BREAKFAST', clue: 'First meal of the day' } },
];

// Word Scramble questions with hints
const scrambleQuestions = [
    { gameType: 'scramble', difficulty: 'easy', content: { word: 'TEACHER', hint: 'Person who educates students' } },
    { gameType: 'scramble', difficulty: 'easy', content: { word: 'LIBRARY', hint: 'Building with many books' } },
    { gameType: 'scramble', difficulty: 'easy', content: { word: 'GARDEN', hint: 'Place to grow plants' } },
    { gameType: 'scramble', difficulty: 'medium', content: { word: 'HOSPITAL', hint: 'Place for medical treatment' } },
    { gameType: 'scramble', difficulty: 'medium', content: { word: 'KNOWLEDGE', hint: 'Understanding gained through learning' } },
    { gameType: 'scramble', difficulty: 'medium', content: { word: 'MOUNTAIN', hint: 'Very high landform' } },
    { gameType: 'scramble', difficulty: 'hard', content: { word: 'ENVIRONMENT', hint: 'Nature around us' } },
    { gameType: 'scramble', difficulty: 'hard', content: { word: 'COMMUNICATION', hint: 'Exchange of information' } },
    { gameType: 'scramble', difficulty: 'hard', content: { word: 'OPPORTUNITY', hint: 'Favorable circumstance' } },
    { gameType: 'scramble', difficulty: 'easy', content: { word: 'FRIEND', hint: 'Person you like and trust' } },
    { gameType: 'scramble', difficulty: 'medium', content: { word: 'BEAUTIFUL', hint: 'Very attractive or pleasing' } },
    { gameType: 'scramble', difficulty: 'easy', content: { word: 'WEATHER', hint: 'Climate conditions outside' } },
];

async function seedGames() {
    try {
        await sequelize.authenticate();
        console.log('Database connected for game seeding');

        // Sync the GameQuestion model (create table if not exists)
        await GameQuestion.sync({ alter: true });
        console.log('GameQuestion table synced');

        // Check if data already exists
        const existingCount = await GameQuestion.count();
        if (existingCount > 0) {
            console.log(`GameQuestion table already has ${existingCount} records. Skipping seed.`);
            console.log('To reseed, delete existing records first.');
            process.exit(0);
        }

        // Insert all game questions
        const allQuestions = [
            ...wordleQuestions,
            ...hangmanQuestions,
            ...scrambleQuestions
        ];

        await GameQuestion.bulkCreate(allQuestions);
        console.log(`✅ Seeded ${allQuestions.length} game questions:`);
        console.log(`   - Wordle: ${wordleQuestions.length} words`);
        console.log(`   - Hangman: ${hangmanQuestions.length} words`);
        console.log(`   - Scramble: ${scrambleQuestions.length} words`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding games:', error);
        process.exit(1);
    }
}

seedGames();
