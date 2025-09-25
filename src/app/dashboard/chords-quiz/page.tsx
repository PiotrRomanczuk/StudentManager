'use client';

import React, { useState } from 'react';

// Chord data: name and finger positions (for SVG rendering)
type Chord = {
	name: string;
	positions: { string: number; fret: number; finger: number }[];
	open: number[];
	muted: number[];
};

const CHORDS: Chord[] = [
	{
		name: 'A',
		positions: [
			{ string: 2, fret: 2, finger: 1 },
			{ string: 3, fret: 2, finger: 2 },
			{ string: 4, fret: 2, finger: 3 },
		],
		open: [1, 5],
		muted: [6],
	},
	{
		name: 'A7',
		positions: [
			{ string: 2, fret: 2, finger: 2 },
			{ string: 4, fret: 2, finger: 3 },
		],
		open: [1, 3, 5],
		muted: [6],
	},
	{
		name: 'Am',
		positions: [
			{ string: 2, fret: 1, finger: 1 },
			{ string: 3, fret: 2, finger: 2 },
			{ string: 4, fret: 2, finger: 3 },
		],
		open: [1, 5],
		muted: [6],
	},
	{
		name: 'B7',
		positions: [
			{ string: 2, fret: 1, finger: 1 },
			{ string: 4, fret: 2, finger: 2 },
			{ string: 0, fret: 2, finger: 3 },
			{ string: 1, fret: 2, finger: 4 },
		],
		open: [3],
		muted: [6],
	},
	{
		name: 'C',
		positions: [
			{ string: 1, fret: 1, finger: 1 },
			{ string: 2, fret: 2, finger: 2 },
			{ string: 4, fret: 3, finger: 3 },
		],
		open: [3, 5],
		muted: [6],
	},
	{
		name: 'D',
		positions: [
			{ string: 1, fret: 2, finger: 1 },
			{ string: 3, fret: 2, finger: 2 },
			{ string: 2, fret: 3, finger: 3 },
		],
		open: [4],
		muted: [5, 6],
	},
	{
		name: 'E',
		positions: [
			{ string: 3, fret: 1, finger: 1 },
			{ string: 5, fret: 2, finger: 2 },
			{ string: 4, fret: 2, finger: 3 },
		],
		open: [0, 2],
		muted: [],
	},
	{
		name: 'Em',
		positions: [
			{ string: 5, fret: 2, finger: 2 },
			{ string: 4, fret: 2, finger: 3 },
		],
		open: [0, 1, 2, 3],
		muted: [],
	},
	// Add more chords as needed
];

function getRandomChords(correctChord: Chord, count = 4): Chord[] {
	// Get random chords including the correct one
	const others = CHORDS.filter((c) => c.name !== correctChord.name);
	const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, count - 1);
	return [...shuffled, correctChord].sort(() => 0.5 - Math.random());
}

function ChordDiagram({ chord, size = 80 }: { chord: Chord; size?: number }) {
	const fretCount = 3;
	const stringCount = 6;
	const fretSpacing = size / (fretCount + 1);
	const stringSpacing = size / (stringCount - 1);
	return (
		<svg width={size} height={size + 20}>
			{/* Strings */}
			{[...Array(stringCount)].map((_, i) => (
				<line
					key={i}
					x1={i * stringSpacing}
					y1={fretSpacing}
					x2={i * stringSpacing}
					y2={fretSpacing * (fretCount + 1)}
					stroke='#222'
					strokeWidth={2}
				/>
			))}
			{/* Frets */}
			{[...Array(fretCount + 2)].map((_, i) => (
				<line
					key={i}
					x1={0}
					y1={fretSpacing * (i + 1)}
					x2={size - stringSpacing}
					y2={fretSpacing * (i + 1)}
					stroke='#222'
					strokeWidth={i === 0 ? 4 : 2}
				/>
			))}
			{/* Dots for fingers */}
			{chord.positions.map((pos, idx) => (
				<circle
					key={idx}
					cx={pos.string * stringSpacing}
					cy={fretSpacing * pos.fret + fretSpacing / 2}
					r={8}
					fill='#4f46e5'
				/>
			))}
			{/* Open/muted indicators */}
			{[...Array(stringCount)].map((_, i) => {
				const stringNum = i;
				if (chord.muted.includes(stringNum)) {
					return (
						<text
							key={'m' + i}
							x={i * stringSpacing}
							y={fretSpacing - 10}
							textAnchor='middle'
							fontSize={14}
							fill='#e11d48'
						>
							X
						</text>
					);
				}
				if (chord.open.includes(stringNum)) {
					return (
						<text
							key={'o' + i}
							x={i * stringSpacing}
							y={fretSpacing - 10}
							textAnchor='middle'
							fontSize={14}
							fill='#16a34a'
						>
							O
						</text>
					);
				}
				return null;
			})}
		</svg>
	);
}

function ChordChoice({
	chord,
	label,
	selected,
	correct,
	onSelect,
	disabled,
}: {
	chord: Chord;
	label: string;
	selected: boolean;
	correct: boolean;
	onSelect: () => void;
	disabled: boolean;
}) {
	let btnClass = 'border rounded-lg p-2 transition-all duration-150 ';
	if (selected) {
		btnClass += correct
			? 'border-green-500 bg-green-100 '
			: 'border-red-500 bg-red-100 ';
	} else {
		btnClass += 'border-gray-300 hover:border-blue-400 ';
	}
	return (
		<button className={btnClass} onClick={onSelect} disabled={disabled}>
			<ChordDiagram chord={chord} size={100} />
			<div className='mt-2 text-center text-sm font-medium'>{label})</div>
		</button>
	);
}

function GuitarChordsQuiz() {
	const [question, setQuestion] = useState<Chord>(() => {
		const idx = Math.floor(Math.random() * CHORDS.length);
		return CHORDS[idx];
	});
	const [choices, setChoices] = useState<Chord[]>(() =>
		getRandomChords(question)
	);
	const [selected, setSelected] = useState<string | null>(null);
	const [feedback, setFeedback] = useState('');

	function handleSelect(choice: Chord) {
		setSelected(choice.name);
		if (choice.name === question.name) {
			setFeedback('Correct!');
		} else {
			setFeedback(`Wrong! That was ${choice.name}.`);
		}
		setTimeout(() => {
			const idx = Math.floor(Math.random() * CHORDS.length);
			const next = CHORDS[idx];
			setQuestion(next);
			setChoices(getRandomChords(next));
			setSelected(null);
			setFeedback('');
		}, 1200);
	}

	return (
		<div className='flex flex-col items-center gap-6 p-6'>
			<h2 className='text-2xl font-bold mb-2'>
				Which diagram is the {question.name} chord?
			</h2>
			<div className='grid grid-cols-2 gap-6'>
				{choices.map((chord, i) => (
					<ChordChoice
						key={chord.name}
						chord={chord}
						label={String.fromCharCode(65 + i)}
						selected={selected === chord.name}
						correct={chord.name === question.name}
						onSelect={() => handleSelect(chord)}
						disabled={!!selected}
					/>
				))}
			</div>
			{feedback && <div className='mt-4 text-lg font-semibold'>{feedback}</div>}
		</div>
	);
}

export default function Page() {
	return <GuitarChordsQuiz />;
}
