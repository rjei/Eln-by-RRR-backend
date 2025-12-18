/**
 * Seeder Script for Lessons
 * 
 * This script populates the database with lesson data that was 
 * previously hardcoded in the frontend LessonView.tsx
 * 
 * Usage:
 *   node src/seeders/seedLessons.js
 * 
 * Make sure to:
 * 1. Have your database connection configured in .env
 * 2. Have courses already seeded in the database
 */

import sequelize from "../config/db.js";
import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";

// Helper function to migrate schema
async function migrateSchema() {
    try {
        console.log("🔧 Checking and migrating lesson schema...\n");

        // Check if 'data' column exists
        const [dataColumns] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Lessons' AND column_name = 'data'
    `);

        if (dataColumns.length === 0) {
            console.log("   Adding 'data' column...");
            await sequelize.query(`ALTER TABLE "Lessons" ADD COLUMN "data" JSONB DEFAULT '{}'`);
            console.log("   ✅ 'data' column added\n");
        } else {
            console.log("   ✅ 'data' column already exists\n");
        }

        // Check if 'duration' column needs migration (INTEGER to TEXT)
        const [durationInfo] = await sequelize.query(`
      SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'Lessons' AND column_name = 'duration'
    `);

        if (durationInfo.length > 0 && durationInfo[0].data_type === 'integer') {
            console.log("   Migrating 'duration' column from INTEGER to TEXT...");
            await sequelize.query(`
        ALTER TABLE "Lessons" ALTER COLUMN "duration" TYPE TEXT USING "duration"::TEXT
      `);
            console.log("   ✅ 'duration' column migrated\n");
        } else {
            console.log("   ✅ 'duration' column type is correct\n");
        }

        return true;
    } catch (error) {
        console.error("   ❌ Schema migration error:", error.message);
        return false;
    }
}

// Lesson data extracted from LessonView.tsx
const lessonsData = [
    // ============================================
    // Course 1: English for Beginners (courseId: 1)
    // ============================================
    {
        id: 1,
        courseId: 1,
        title: "Welcome to English Learning",
        duration: "5 menit",
        order: 1,
        videoUrl: null,
        content: `Selamat datang di kursus English for Beginners! 

Kursus ini dirancang khusus untuk Anda yang ingin memulai perjalanan belajar bahasa Inggris dari nol. Kami akan membantu Anda memahami dasar-dasar bahasa Inggris dengan cara yang mudah dan menyenangkan.

Apa yang akan Anda pelajari:
• Alphabet dan pronunciation
• Vocabulary dasar sehari-hari
• Grammar fundamental
• Conversation sederhana
• Listening comprehension

Metode pembelajaran:
Kami menggunakan pendekatan interaktif yang menggabungkan video, audio, teks, dan latihan interaktif. Setiap lesson dirancang untuk membangun pemahaman Anda secara bertahap.

Tips untuk sukses:
1. Luangkan waktu 20-30 menit setiap hari untuk belajar
2. Jangan takut membuat kesalahan - itu bagian dari proses belajar
3. Praktikkan apa yang Anda pelajari dalam kehidupan sehari-hari
4. Ulangi materi yang sulit sampai Anda memahaminya

Mari kita mulai perjalanan belajar bahasa Inggris Anda!`,
        transcript: [],
        data: {
            vocabulary: [
                {
                    word: "Welcome",
                    meaning: "Selamat datang",
                    example: "Welcome to our class!",
                },
                {
                    word: "Learning",
                    meaning: "Pembelajaran",
                    example: "English learning is fun!",
                },
                {
                    word: "Beginner",
                    meaning: "Pemula",
                    example: "This course is for beginners.",
                },
            ],
            quiz: {
                question: 'Apa arti dari kata "Welcome"?',
                options: [
                    "Selamat tinggal",
                    "Selamat datang",
                    "Terima kasih",
                    "Sampai jumpa",
                ],
                correctAnswer: 1,
            },
        },
    },
    {
        id: 2,
        courseId: 1,
        title: "Basic Greetings & Introductions",
        duration: "12 menit",
        order: 2,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        content: `Greetings (Salam) adalah cara kita menyapa orang lain dalam bahasa Inggris. Mari pelajari berbagai cara menyapa dalam situasi berbeda.

Common Greetings:
• Hello / Hi - Halo (informal)
• Good morning - Selamat pagi
• Good afternoon - Selamat siang
• Good evening - Selamat sore/malam
• How are you? - Apa kabar?

Responding to Greetings:
• I'm fine, thank you - Saya baik, terima kasih
• I'm good - Saya baik
• Not bad - Lumayan
• I'm great! - Saya sangat baik!

Self Introduction:
"Hello, my name is [Your Name]. I'm from [Your City]. Nice to meet you!"

Practice:
Coba perkenalkan diri Anda dalam bahasa Inggris menggunakan format di atas. Ulangi beberapa kali sampai Anda merasa nyaman.`,
        transcript: [
            {
                id: 1,
                startTime: 0,
                endTime: 7,
                text: "Hello everyone! Today we're going to learn about greetings and introductions in English.",
                speaker: "Teacher",
            },
            {
                id: 2,
                startTime: 7,
                endTime: 14,
                text: "We use different greetings for different times of the day. Good morning, good afternoon, and good evening.",
                speaker: "Teacher",
            },
            {
                id: 3,
                startTime: 14,
                endTime: 22,
                text: "When meeting someone for the first time, you can say: Nice to meet you! or Pleased to meet you!",
                speaker: "Teacher",
            },
            {
                id: 4,
                startTime: 22,
                endTime: 30,
                text: "Let's practice these greetings together. Remember to smile and make eye contact!",
                speaker: "Teacher",
            },
        ],
        data: {
            vocabulary: [
                { word: "Hello", meaning: "Halo", example: "Hello! How are you?" },
                {
                    word: "Morning",
                    meaning: "Pagi",
                    example: "Good morning, everyone!",
                },
                { word: "Meet", meaning: "Bertemu", example: "Nice to meet you!" },
                { word: "Name", meaning: "Nama", example: "My name is Sarah." },
            ],
            quiz: {
                question: "Bagaimana cara menyapa orang di pagi hari dalam bahasa Inggris?",
                options: [
                    "Good night",
                    "Good morning",
                    "Good evening",
                    "Good afternoon",
                ],
                correctAnswer: 1,
            },
        },
    },
    {
        id: 3,
        courseId: 1,
        title: "Practice: Self Introduction",
        duration: "10 menit",
        order: 3,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        content: `Sekarang saatnya praktek! Mari kita latih kemampuan memperkenalkan diri dalam bahasa Inggris.

Template Perkenalan Diri:

Basic Introduction:
"Hello, my name is _____. I'm from _____. Nice to meet you!"

Extended Introduction:
"Hi! My name is _____. I'm from _____ in _____. 
I'm a _____ (pekerjaan/status). 
I like _____ (hobi). 
Pleased to meet you!"

Contoh:
"Hi! My name is Budi. I'm from Jakarta in Indonesia.
I'm a student.
I like reading and playing football.
Pleased to meet you!"

Exercise:
Buatlah perkenalan diri Anda sendiri menggunakan template di atas. Tuliskan dan ucapkan dengan lantang beberapa kali.

Key Phrases:
• My name is... - Nama saya adalah...
• I'm from... - Saya berasal dari...
• I like... - Saya suka...
• Nice to meet you - Senang bertemu denganmu
• Pleased to meet you - Senang berkenalan denganmu`,
        transcript: [
            {
                id: 1,
                startTime: 0,
                endTime: 8,
                text: "Welcome back! In this lesson, we'll practice introducing ourselves in English.",
                speaker: "Teacher",
            },
            {
                id: 2,
                startTime: 8,
                endTime: 16,
                text: "Let's start with a basic template: Hello, my name is [your name]. I'm from [your city].",
                speaker: "Teacher",
            },
            {
                id: 3,
                startTime: 16,
                endTime: 24,
                text: "You can add more information like your job or hobbies. For example: I'm a teacher. I like reading books.",
                speaker: "Teacher",
            },
            {
                id: 4,
                startTime: 24,
                endTime: 32,
                text: "Always end with a friendly phrase like 'Nice to meet you!' or 'Pleased to meet you!'",
                speaker: "Teacher",
            },
            {
                id: 5,
                startTime: 32,
                endTime: 40,
                text: "Now practice saying your own introduction out loud. Don't be shy!",
                speaker: "Teacher",
            },
        ],
        data: {
            vocabulary: [
                {
                    word: "Introduction",
                    meaning: "Perkenalan",
                    example: "Let me make an introduction.",
                },
                {
                    word: "Student",
                    meaning: "Pelajar/Mahasiswa",
                    example: "I am a student.",
                },
                { word: "Like", meaning: "Suka", example: "I like music." },
                {
                    word: "Pleased",
                    meaning: "Senang",
                    example: "Pleased to meet you!",
                },
            ],
            quiz: {
                question: 'Apa bahasa Inggris dari "Senang bertemu denganmu"?',
                options: [
                    "See you later",
                    "Nice to meet you",
                    "Good bye",
                    "How are you",
                ],
                correctAnswer: 1,
            },
        },
    },
    {
        id: 7,
        courseId: 1,
        title: "Numbers 1-100",
        duration: "10 menit",
        order: 4,
        videoUrl: null,
        content: `Mari mulai menghafal angka 1 sampai 100 dalam bahasa Inggris. Fokus pada pola pengucapan agar kamu bisa menyebutkan nomor telepon, usia, atau tanggal dengan percaya diri.

Numbers Highlights:
• 1–10: one, two, three, four, five, six, seven, eight, nine, ten
• 11–20: eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty
• Puluhan: twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred
• Gabungkan: twenty-one, thirty-five, forty-six, dll.

Cara belajar cepat:
1. Latih membaca angka berkelompok (20-29, 30-39, dst.)
2. Ucapkan angka dalam bentuk kalimat (I have twenty books).
3. Lakukan counting backward untuk melatih listening.`,
        transcript: [],
        data: {
            vocabulary: [
                { word: "One", meaning: "Satu", example: "One apple" },
                { word: "Twenty", meaning: "Dua puluh", example: "Twenty minutes" },
                { word: "Thirty-five", meaning: "Tiga puluh lima", example: "I am thirty-five years old" },
                { word: "Hundred", meaning: "Seratus", example: "One hundred students" },
            ],
            quiz: {
                question: "Bagaimana cara mengucapkan angka 47 dalam bahasa Inggris?",
                options: ["Four ten seven", "Forty seven", "Fourty seven", "Seven forty"],
                correctAnswer: 1,
            },
        },
    },
    {
        id: 8,
        courseId: 1,
        title: "Colors & Shapes",
        duration: "8 menit",
        order: 5,
        videoUrl: null,
        content: `Warna dan bentuk adalah kata dasar yang sering muncul saat mendeskripsikan lingkungan. Kita akan belajar nama warna dan bentuk sambil mempraktikkan kalimat sederhana.

Colors:
• Red, orange, yellow, green, blue, purple, pink, brown, gray, black, white
• Contoh: "The ball is red" atau "Her dress is blue"

Shapes:
• Circle, square, triangle, rectangle, diamond, star, oval
• Contoh penggabungan: "The yellow circle is inside the blue square"

Latihan:
1. Sebutkan objek dan warnanya di sekitar kamu.
2. Gambarkan bentuk favorit dan sebutkan warnanya dalam bahasa Inggris.`,
        transcript: [],
        data: {
            vocabulary: [
                { word: "Red", meaning: "Merah", example: "The apple is red" },
                { word: "Circle", meaning: "Lingkaran", example: "Draw a circle" },
                { word: "Square", meaning: "Persegi", example: "The window is a square" },
                { word: "Purple", meaning: "Ungu", example: "She likes purple flowers" },
            ],
            quiz: {
                question: "Bagaimana cara mengatakan 'lingkaran hijau' dalam bahasa Inggris?",
                options: ["Green circle", "Circle green", "Green round", "Circle of green"],
                correctAnswer: 0,
            },
        },
    },
    {
        id: 9,
        courseId: 1,
        title: "Quiz: Numbers & Colors",
        duration: "15 menit",
        order: 6,
        videoUrl: null,
        content: `Kombinasikan angka dan warna dalam satu soal. Kamu diminta menjawab pilihan ganda dan membuat deskripsi pendek.

Jenis soal:
• Cerita pendek: "The purple star is next to the blue circle."
• Pilihan ganda mengenai angka dan warna yang sudah dipelajari.`,
        transcript: [],
        data: {
            vocabulary: [
                { word: "Describe", meaning: "Menjelaskan", example: "Describe the purple circle" },
                { word: "Pattern", meaning: "Pola", example: "The pattern repeats every five numbers" },
                { word: "Shade", meaning: "Nuansa", example: "A darker shade of blue" },
            ],
            quiz: {
                question: "Apa jawaban yang benar untuk angka 63 dalam bahasa Inggris?",
                options: ["Sixty-three", "Six-three", "Three sixty", "Sixty free"],
                correctAnswer: 0,
            },
        },
    },

    // ============================================
    // Course 2: Intermediate English Mastery (courseId: 2)
    // ============================================
    {
        id: 4,
        courseId: 2,
        title: "Present Perfect Tense",
        duration: "18 menit",
        order: 1,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        content: `Present Perfect Tense digunakan untuk menyatakan tindakan yang telah selesai di waktu yang tidak spesifik atau tindakan yang masih berhubungan dengan saat ini.

Formula:
Subject + have/has + past participle (V3)

Positive:
• I have studied English for 5 years.
• She has visited Bali twice.
• They have finished their homework.

Negative:
• I have not (haven't) eaten breakfast.
• He has not (hasn't) arrived yet.

Question:
• Have you ever been to Japan?
• Has she called you today?

Time Markers:
• already - sudah
• yet - belum (dalam kalimat negatif/tanya)
• just - baru saja
• ever - pernah
• never - tidak pernah
• for - selama (durasi)
• since - sejak (titik waktu)

Contoh dalam Percakapan:
A: "Have you finished your project?"
B: "Yes, I have just completed it."

A: "Has John arrived?"
B: "No, he hasn't arrived yet."

Perbedaan dengan Simple Past:
• Simple Past: I went to Paris in 2020. (waktu spesifik)
• Present Perfect: I have been to Paris. (pengalaman, waktu tidak penting)`,
        transcript: [
            {
                id: 1,
                startTime: 0,
                endTime: 10,
                text: "Today we're learning about Present Perfect Tense. This is an important grammar structure in English.",
                speaker: "Teacher",
            },
            {
                id: 2,
                startTime: 10,
                endTime: 20,
                text: "We use Present Perfect to talk about actions that happened at an unspecified time or actions that affect the present.",
                speaker: "Teacher",
            },
            {
                id: 3,
                startTime: 20,
                endTime: 30,
                text: "The formula is: Subject plus have or has, plus the past participle form of the verb.",
                speaker: "Teacher",
            },
            {
                id: 4,
                startTime: 30,
                endTime: 40,
                text: "For example: I have studied English for five years. She has visited Bali twice.",
                speaker: "Teacher",
            },
            {
                id: 5,
                startTime: 40,
                endTime: 50,
                text: "Common time markers include: already, yet, just, ever, and never. These help us know when to use Present Perfect.",
                speaker: "Teacher",
            },
            {
                id: 6,
                startTime: 50,
                endTime: 60,
                text: "Remember: Have you ever been to Japan? Has she called you today? These are typical Present Perfect questions.",
                speaker: "Teacher",
            },
        ],
        data: {
            vocabulary: [
                {
                    word: "Already",
                    meaning: "Sudah",
                    example: "I have already finished my homework.",
                },
                {
                    word: "Yet",
                    meaning: "Belum",
                    example: "Have you finished yet?",
                },
                {
                    word: "Just",
                    meaning: "Baru saja",
                    example: "She has just left the office.",
                },
                {
                    word: "Experience",
                    meaning: "Pengalaman",
                    example: "I have experience in teaching.",
                },
            ],
            quiz: {
                question: "Mana kalimat Present Perfect yang benar?",
                options: [
                    "I have went to London.",
                    "I have go to London.",
                    "I have gone to London.",
                    "I has gone to London.",
                ],
                correctAnswer: 2,
            },
        },
    },
    {
        id: 5,
        courseId: 2,
        title: "Business & Professional Vocabulary",
        duration: "16 menit",
        order: 2,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        content: `Vocabulary profesional sangat penting untuk berkomunikasi di lingkungan kerja. Mari pelajari istilah-istilah bisnis yang umum digunakan.

Office & Workplace:
• Meeting - Rapat/Pertemuan
• Deadline - Tenggat waktu
• Project - Proyek
• Presentation - Presentasi
• Report - Laporan
• Schedule - Jadwal
• Colleague - Rekan kerja
• Manager - Manajer
• Department - Departemen
• Client - Klien

Business Actions:
• To schedule - Menjadwalkan
• To attend - Menghadiri
• To submit - Menyerahkan
• To review - Meninjau
• To approve - Menyetujui
• To negotiate - Bernegosiasi
• To collaborate - Berkolaborasi

Email Phrases:
• "I am writing to..." - Saya menulis untuk...
• "Please find attached..." - Terlampir...
• "Thank you for your prompt reply" - Terima kasih atas balasan cepatnya
• "I look forward to hearing from you" - Saya menunggu kabar dari Anda
• "Best regards" - Salam hormat

Meeting Phrases:
• "Let's get started" - Mari kita mulai
• "I'd like to suggest..." - Saya ingin menyarankan...
• "What do you think about...?" - Apa pendapat Anda tentang...?
• "Could you elaborate on that?" - Bisakah Anda menjelaskan lebih detail?

Contoh Situasi:
"Good morning everyone. Let's get started with today's meeting. First, I'd like to review the progress on our current project. The deadline is next Friday, so we need to collaborate effectively to submit the final report on time."`,
        transcript: [
            {
                id: 1,
                startTime: 0,
                endTime: 8,
                text: "Welcome to Business and Professional Vocabulary. Today we'll learn essential business terms.",
                speaker: "Teacher",
            },
            {
                id: 2,
                startTime: 8,
                endTime: 16,
                text: "Let's start with common office words: Meeting, Deadline, Project, Presentation, and Report.",
                speaker: "Teacher",
            },
            {
                id: 3,
                startTime: 16,
                endTime: 24,
                text: "In business communication, we often say: Could you please send me the report? or Let's schedule a meeting.",
                speaker: "Teacher",
            },
            {
                id: 4,
                startTime: 24,
                endTime: 32,
                text: "Important business verbs include: negotiate, collaborate, implement, analyze, and coordinate.",
                speaker: "Teacher",
            },
            {
                id: 5,
                startTime: 32,
                endTime: 40,
                text: "Remember to be professional and polite in all business communications. Use phrases like 'I appreciate your help' or 'Thank you for your time'.",
                speaker: "Teacher",
            },
        ],
        data: {
            vocabulary: [
                {
                    word: "Deadline",
                    meaning: "Tenggat waktu",
                    example: "The deadline for this project is Monday.",
                },
                {
                    word: "Colleague",
                    meaning: "Rekan kerja",
                    example: "My colleagues are very supportive.",
                },
                {
                    word: "Negotiate",
                    meaning: "Bernegosiasi",
                    example: "We need to negotiate the contract terms.",
                },
                {
                    word: "Collaborate",
                    meaning: "Berkolaborasi",
                    example: "Let's collaborate on this project.",
                },
            ],
            quiz: {
                question: 'Apa arti dari "deadline" dalam konteks bisnis?',
                options: [
                    "Waktu istirahat",
                    "Tenggat waktu",
                    "Waktu mulai",
                    "Waktu kerja",
                ],
                correctAnswer: 1,
            },
        },
    },
    {
        id: 6,
        courseId: 2,
        title: "Small Talk & Social Situations",
        duration: "16 menit",
        order: 3,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        content: `Small talk adalah percakapan ringan yang penting untuk membangun hubungan sosial dan profesional. Mari pelajari cara melakukan small talk yang natural.

Common Small Talk Topics:
1. Weather (Cuaca)
"Nice weather today, isn't it?"
"It's quite hot/cold today."

2. Weekend Plans (Rencana Akhir Pekan)
"Do you have any plans for the weekend?"
"What did you do last weekend?"

3. Hobbies & Interests (Hobi & Minat)
"What do you like to do in your free time?"
"Have you seen any good movies lately?"

4. Current Events (Berita Terkini)
"Did you hear about...?"
"Have you been following...?"

Opening Small Talk:
• "How's your day going?"
• "How have you been?"
• "What have you been up to?"
• "Long time no see!"

Keeping the Conversation Going:
• "That's interesting! Tell me more."
• "Really? How did that happen?"
• "I know what you mean."
• "That reminds me of..."

Closing Small Talk:
• "It was nice talking to you."
• "I should get going, but let's catch up soon."
• "Take care!"
• "See you around!"

Contoh Dialog:
A: "Hi Sarah! How's your day going?"
B: "Pretty good, thanks! How about you?"
A: "Not bad. Do you have any plans for the weekend?"
B: "I'm thinking of going hiking. The weather looks great!"
A: "That sounds fun! I love hiking too."

Tips:
• Tunjukkan minat dengan pertanyaan follow-up
• Hindari topik sensitif (politik, agama, gaji)
• Perhatikan body language
• Tersenyum dan maintain eye contact`,
        transcript: [
            {
                id: 1,
                startTime: 0,
                endTime: 8,
                text: "Small talk is an important skill for building relationships. Let's learn how to do it naturally.",
                speaker: "Teacher",
            },
            {
                id: 2,
                startTime: 8,
                endTime: 16,
                text: "Safe topics include weather, weekend plans, hobbies, and recent events. Avoid politics, religion, or personal finances.",
                speaker: "Teacher",
            },
            {
                id: 3,
                startTime: 16,
                endTime: 24,
                text: "To start: Nice weather today, isn't it? Or: Do you have any plans for the weekend?",
                speaker: "Teacher",
            },
            {
                id: 4,
                startTime: 24,
                endTime: 32,
                text: "Keep the conversation going with follow-up questions: That's interesting! Tell me more. Or: Really? How did that happen?",
                speaker: "Teacher",
            },
            {
                id: 5,
                startTime: 32,
                endTime: 40,
                text: "To close politely: It was nice talking to you! or I should get going, but let's catch up soon!",
                speaker: "Teacher",
            },
        ],
        data: {
            vocabulary: [
                {
                    word: "Lately",
                    meaning: "Akhir-akhir ini",
                    example: "Have you been busy lately?",
                },
                {
                    word: "Catch up",
                    meaning: "Mengobrol/berbincang lagi",
                    example: "Let's catch up over coffee sometime.",
                },
                {
                    word: "Long time no see",
                    meaning: "Lama tidak bertemu",
                    example: "Hey John! Long time no see!",
                },
                {
                    word: "What have you been up to",
                    meaning: "Apa yang sudah kamu lakukan",
                    example: "What have you been up to these days?",
                },
            ],
            quiz: {
                question: "Frasa mana yang tepat untuk membuka small talk?",
                options: [
                    "What is your salary?",
                    "How's your day going?",
                    "How old are you?",
                    "Where do you live exactly?",
                ],
                correctAnswer: 1,
            },
        },
    },
    {
        id: 10,
        courseId: 2,
        title: "Past Perfect & Future Perfect",
        duration: "18 menit",
        order: 4,
        videoUrl: null,
        content: `Past Perfect digunakan untuk mengekspresikan aksi yang telah selesai sebelum aksi lain terjadi. Future Perfect menceritakan aksi yang akan selesai sebelum waktu tertentu di masa depan.

Past Perfect Formula:
• Subject + had + past participle

Future Perfect Formula:
• Subject + will have + past participle

Kunci:
1. Past Perfect sering muncul bersama kata "before", "after", "already".
2. Future Perfect sering dipakai dengan "by tomorrow", "by next week".
3. Latihan: buat dua kalimat untuk setiap tense menggunakan action yang berbeda.`,
        transcript: [],
        data: {
            vocabulary: [
                { word: "Already", meaning: "Sudah", example: "She had already left when we arrived." },
                { word: "By then", meaning: "Saat itu", example: "By then, he will have finished the project." },
                { word: "Had", meaning: "Telah", example: "I had visited Paris before I turned 20." },
                { word: "Will have", meaning: "Akan sudah", example: "By midnight, we will have completed the assignment." },
            ],
            quiz: {
                question: "Mana kalimat Future Perfect yang benar?",
                options: [
                    "She will have go home by 9 PM.",
                    "She will have gone home by 9 PM.",
                    "She will had gone home by 9 PM.",
                    "She had will have gone home by 9 PM.",
                ],
                correctAnswer: 1,
            },
        },
    },
    {
        id: 11,
        courseId: 2,
        title: "Conditional Sentences (Type 1-3)",
        duration: "15 menit",
        order: 5,
        videoUrl: null,
        content: `Conditional Type 1 (real present/future): If + present simple, will + verb.
Conditional Type 2 (unreal present): If + past simple, would + verb.
Conditional Type 3 (past unreal): If + past perfect, would have + past participle.

Tips:
1. Gunakan type 1 untuk hal kemungkinan terjadi.
2. Type 2 dipakai untuk situasi imajinasi sekarang.
3. Type 3 mendeskripsikan penyesalan atau kejadian lampau yang berbeda.`,
        transcript: [],
        data: {
            vocabulary: [
                { word: "If", meaning: "Jika", example: "If it rains, we will stay home." },
                { word: "Would", meaning: "Akan", example: "If I had money, I would travel." },
                { word: "Had", meaning: "Telah", example: "If he had studied, he would have passed." },
                { word: "Will", meaning: "Akan", example: "She will come if she is invited." },
            ],
            quiz: {
                question: "Pilih kalimat Conditional Type 2 yang benar:",
                options: [
                    "If I will win, I'll celebrate tomorrow.",
                    "If I won the lottery, I would buy a house.",
                    "If I had known, I would call you now.",
                    "If he goes, he would be happy.",
                ],
                correctAnswer: 1,
            },
        },
    },
    {
        id: 12,
        courseId: 2,
        title: "Passive Voice",
        duration: "14 menit",
        order: 6,
        videoUrl: null,
        content: `Passive Voice digunakan saat fokus pada objek yang menerima aksi. Rumus: be + past participle.

Contoh:
• Active: The chef cooks the meal.
• Passive: The meal is cooked by the chef.

Latihan:
1. Ubah kalimat aktif menjadi pasif dengan berbagai tense.
2. Gunakan "by" untuk menyebut pelaku jika perlu.
3. Perhatikan perubahan tense pada kata "be".`,
        transcript: [],
        data: {
            vocabulary: [
                { word: "is/are", meaning: "adalah", example: "The letter is sent every morning." },
                { word: "was/were", meaning: "telah", example: "The cake was eaten." },
                { word: "being", meaning: "sedang", example: "The car is being washed." },
                { word: "By", meaning: "oleh", example: "The novel was written by Maya." },
            ],
            quiz: {
                question: "Pilih kalimat passive yang benar:",
                options: [
                    "A new movie will released next week.",
                    "A new movie is released next week.",
                    "A new movie will be released next week.",
                    "A new movie released next week.",
                ],
                correctAnswer: 2,
            },
        },
    },
    {
        id: 13,
        courseId: 2,
        title: "Reported Speech",
        duration: "16 menit",
        order: 7,
        videoUrl: null,
        content: `Reported speech atau indirect speech dipakai untuk menyampaikan kembali apa yang dikatakan orang lain.

Aturan penting:
• Tenses mundur satu level (ex: present -> past).
• "Say" berubah menjadi "said" atau "told".
• Gunakan "that" untuk menghubungkan jika perlu.

Praktik:
1. Ubah kalimat langsung ke tidak langsung.
2. Perhatikan perubahan kata keterangan waktu dan pronoun.
3. Tambahkan "to" setelah "told" jika ada object.`,
        transcript: [],
        data: {
            vocabulary: [
                { word: "Said", meaning: "Mengatakan", example: "He said that he was ready." },
                { word: "Told", meaning: "Beritahu", example: "She told me to wait." },
                { word: "That", meaning: "Bahwa", example: "He said that he liked it." },
                { word: "Would", meaning: "Akan", example: "She said she would help." },
            ],
            quiz: {
                question: "Ubah kalimat berikut ke reported speech: She said, 'I can help you.'",
                options: [
                    "She said she could help me.",
                    "She said she can help me.",
                    "She tell me she could help.",
                    "She told I could help her.",
                ],
                correctAnswer: 0,
            },
        },
    },

    // ============================================
    // Course 3: Business English Professional (courseId: 3)
    // ============================================
    {
        id: 101,
        courseId: 3,
        title: "Professional Email Writing",
        duration: "20 menit",
        order: 1,
        videoUrl: null,
        content: `Email profesional adalah keterampilan penting dalam dunia bisnis modern. Mari pelajari cara menulis email yang efektif dan profesional.

Email Structure (Struktur Email):

1. Subject Line (Subjek)
• Clear and specific - Jelas dan spesifik
• Include key information - Sertakan informasi penting
• Examples: "Meeting Request - Project Update", "Follow-up: Q4 Sales Report"

2. Greeting/Salutation (Salam Pembuka)
• Formal: "Dear Mr./Ms. [Last Name],"
• Semi-formal: "Hello [First Name],"
• Team email: "Dear Team," or "Hi everyone,"

3. Opening (Pembukaan)
• State your purpose immediately
• "I am writing to..."
• "I hope this email finds you well..."
• "Following up on our conversation..."

4. Body (Isi Utama)
• Keep it concise and clear
• Use bullet points for multiple items
• One topic per paragraph
• Be specific and actionable

5. Closing (Penutup)
• Thank you statement
• Call to action
• "Please let me know if you need any further information."
• "I look forward to hearing from you."

6. Sign-off (Salam Penutup)
• Formal: "Sincerely," "Best regards," "Kind regards,"
• Semi-formal: "Thanks," "Best," "Cheers,"

Professional Email Phrases:

Opening:
• "I hope this email finds you well."
• "Thank you for your email regarding..."
• "I am writing to inquire about..."

Requesting:
• "Could you please...?"
• "I would appreciate if you could..."
• "Would it be possible to...?"

Responding:
• "Thank you for bringing this to my attention."
• "I appreciate your prompt response."
• "As discussed in our meeting..."

Apologizing:
• "I apologize for any inconvenience."
• "Sorry for the delayed response."
• "I regret to inform you that..."

Example Professional Email:

Subject: Project Timeline - Q1 2024

Dear Ms. Johnson,

I hope this email finds you well. I am writing to follow up on our discussion about the Q1 2024 project timeline.

As discussed in our meeting, I would like to propose the following schedule:
• Project kickoff: January 15, 2024
• First milestone: February 1, 2024
• Final delivery: March 30, 2024

Could you please review this timeline and let me know if it works for your team?

I look forward to your feedback.

Best regards,
John Smith
Project Manager`,
        transcript: [],
        data: {
            vocabulary: [
                {
                    word: "Inquire",
                    meaning: "Menanyakan",
                    example: "I am writing to inquire about the position.",
                },
                {
                    word: "Regarding",
                    meaning: "Mengenai",
                    example: "Regarding your email, I have some questions.",
                },
                {
                    word: "Appreciate",
                    meaning: "Menghargai",
                    example: "I appreciate your quick response.",
                },
                {
                    word: "Prompt",
                    meaning: "Cepat/Segera",
                    example: "Thank you for your prompt reply.",
                },
                {
                    word: "Attach",
                    meaning: "Melampirkan",
                    example: "Please find attached the document.",
                },
            ],
            quiz: {
                question: "What is the most professional way to start a business email?",
                options: [
                    "Hey, what's up?",
                    "Dear Mr. Smith,",
                    "Yo!",
                    "Hi there!",
                ],
                correctAnswer: 1,
            },
        },
    },

    // ============================================
    // Course 4: TOEFL Preparation (courseId: 4)
    // ============================================
    {
        id: 201,
        courseId: 4,
        title: "TOEFL Reading Strategies",
        duration: "25 menit",
        order: 1,
        videoUrl: null,
        content: `TOEFL Reading section mengukur kemampuan Anda memahami teks akademik dalam bahasa Inggris. Mari pelajari strategi efektif untuk menghadapi section ini.

TOEFL Reading Section Overview:

Format:
• 3-4 passages (700 words each)
• 10 questions per passage
• 54-72 minutes total
• Academic topics from various fields

Question Types:

1. Factual Information Questions
• "According to the paragraph..."
• "The author mentions X in order to..."
• Strategy: Scan for specific information

2. Negative Factual Information
• "All of the following are mentioned EXCEPT..."
• Strategy: Eliminate wrong answers

3. Inference Questions
• "What can be inferred about...?"
• "The author implies that..."
• Strategy: Read between the lines

4. Vocabulary Questions
• "The word X in the passage is closest in meaning to..."
• Strategy: Use context clues

5. Reference Questions
• "The word 'it' in the passage refers to..."
• Strategy: Check preceding sentences

6. Sentence Simplification
• "Which sentence best expresses the essential information?"
• Strategy: Identify main ideas

7. Insert Text Questions
• "Where would the sentence best fit?"
• Strategy: Look for logical transitions

8. Prose Summary
• Choose 3 main ideas from 6 options
• Strategy: Focus on big picture

9. Fill in a Table
• Categorize information
• Strategy: Understand organizational structure

Key Strategies:

1. Time Management:
• Spend 20 minutes per passage
• Don't get stuck on one question
• Flag difficult questions and return later

2. Skimming Technique:
• Read title and introduction
• Read first sentence of each paragraph
• Read conclusion
• Get the main idea before details

3. Scanning for Details:
• Use keywords from questions
• Locate specific information quickly
• Don't read every word

4. Vocabulary Building:
• Learn academic word list
• Study prefixes and suffixes
• Practice context clues

5. Note-Taking:
• Write key points briefly
• Use abbreviations
• Note paragraph main ideas

Practice Tips:

1. Read academic articles daily
• Science journals
• History texts
• Social sciences

2. Build reading speed
• Start with 250 words/minute
• Gradually increase speed

3. Practice with time limits
• Simulate test conditions
• Use official practice tests

4. Analyze mistakes
• Understand why answers are wrong
• Learn from error patterns

Common Mistakes to Avoid:

1. Reading too slowly
• Don't try to understand every word
• Focus on main ideas

2. Choosing answers based on memory
• Always refer back to passage
• Don't rely on prior knowledge

3. Overthinking
• Trust your first impression
• Don't second-guess excessively

4. Ignoring transition words
• "However," "Therefore," "In contrast"
• These signal relationships

Remember: Practice makes perfect! Take multiple practice tests to improve your skills.`,
        transcript: [],
        data: {
            vocabulary: [
                {
                    word: "Inference",
                    meaning: "Kesimpulan",
                    example: "Make an inference based on the passage.",
                },
                {
                    word: "Imply",
                    meaning: "Mengisyaratkan",
                    example: "The author implies that climate change is serious.",
                },
                {
                    word: "Paraphrase",
                    meaning: "Mengungkapkan kembali",
                    example: "Paraphrase the main idea in your own words.",
                },
                {
                    word: "Skim",
                    meaning: "Membaca sekilas",
                    example: "Skim the passage to get the main idea.",
                },
                {
                    word: "Scan",
                    meaning: "Memindai",
                    example: "Scan the text for specific information.",
                },
            ],
            quiz: {
                question: "How much time should you spend on each TOEFL reading passage?",
                options: [
                    "10 minutes",
                    "20 minutes",
                    "30 minutes",
                    "40 minutes",
                ],
                correctAnswer: 1,
            },
        },
    },
];

async function seedLessons() {
    try {
        console.log("🌱 Starting lesson seeder...\n");

        // Test database connection
        await sequelize.authenticate();
        console.log("✅ Database connected successfully\n");

        // Run schema migration first (before sync)
        const migrationSuccess = await migrateSchema();
        if (!migrationSuccess) {
            console.log("⚠️  Schema migration had issues, but continuing...\n");
        }

        // Check if courses exist
        const courses = await Course.findAll();
        if (courses.length === 0) {
            console.log("⚠️  No courses found in database. Please seed courses first.");
            console.log("   You can create courses manually or run a course seeder.\n");

            // Create default courses if none exist
            console.log("📦 Creating default courses...\n");
            await Course.bulkCreate([
                {
                    id: 1,
                    title: "English for Beginners",
                    description: "Kursus dasar untuk pemula yang ingin belajar bahasa Inggris dari nol.",
                    level: "Beginner",
                    duration: "8 minggu",
                    category: "Beginner"
                },
                {
                    id: 2,
                    title: "Intermediate English Mastery",
                    description: "Tingkatkan kemampuan bahasa Inggris Anda ke level menengah dengan materi grammar dan vocabulary yang lebih kompleks.",
                    level: "Intermediate",
                    duration: "10 minggu",
                    category: "Intermediate"
                },
                {
                    id: 3,
                    title: "Business English Professional",
                    description: "Kuasai bahasa Inggris untuk keperluan bisnis dan profesional.",
                    level: "Advanced",
                    duration: "12 minggu",
                    category: "Business"
                },
                {
                    id: 4,
                    title: "TOEFL Preparation",
                    description: "Persiapan lengkap untuk menghadapi tes TOEFL dengan strategi dan latihan intensif.",
                    level: "Advanced",
                    duration: "8 minggu",
                    category: "Test Prep"
                }
            ]);
            console.log("✅ Default courses created\n");
        }

        // Clear existing lessons
        console.log("🗑️  Clearing existing lessons...");
        await sequelize.query('DELETE FROM "Lessons"');
        console.log("✅ Existing lessons cleared\n");

        // Reset sequence for auto-increment
        try {
            await sequelize.query('ALTER SEQUENCE "Lessons_id_seq" RESTART WITH 1');
            console.log("✅ ID sequence reset\n");
        } catch (e) {
            // Sequence might not exist or have different name
            console.log("⚠️  Could not reset sequence (this is usually fine)\n");
        }

        // Insert lessons
        console.log("📚 Inserting lesson data...\n");

        for (const lesson of lessonsData) {
            try {
                // Use raw query to avoid model validation issues
                await sequelize.query(`
                    INSERT INTO "Lessons" (
                        "id", "courseId", "title", "content", "order", 
                        "videoUrl", "thumbnail", "duration", "transcript", "data",
                        "createdAt", "updatedAt"
                    ) VALUES (
                        :id, :courseId, :title, :content, :order,
                        :videoUrl, :thumbnail, :duration, :transcript, :data,
                        NOW(), NOW()
                    )
                `, {
                    replacements: {
                        id: lesson.id,
                        courseId: lesson.courseId,
                        title: lesson.title,
                        content: lesson.content || '',
                        order: lesson.order,
                        videoUrl: lesson.videoUrl || null,
                        thumbnail: lesson.thumbnail || null,
                        duration: lesson.duration || '0 menit',
                        transcript: JSON.stringify(lesson.transcript || []),
                        data: JSON.stringify(lesson.data || {})
                    }
                });
                console.log(`   ✅ Lesson ${lesson.id}: "${lesson.title}" created`);
            } catch (err) {
                console.log(`   ❌ Lesson ${lesson.id}: "${lesson.title}" failed - ${err.message}`);
            }
        }

        // Update sequence to max ID + 1
        try {
            const maxId = Math.max(...lessonsData.map(l => l.id));
            await sequelize.query(`ALTER SEQUENCE "Lessons_id_seq" RESTART WITH ${maxId + 1}`);
        } catch (e) {
            // Ignore
        }

        console.log("\n✅ Seeding completed successfully!");
        console.log(`   Total lessons seeded: ${lessonsData.length}`);

        // Close connection
        await sequelize.close();
        console.log("\n👋 Database connection closed.");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Seeding failed:", error);
        process.exit(1);
    }
}

// Run the seeder
seedLessons();

