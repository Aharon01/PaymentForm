import React, { useState } from 'react'

export function BuyCredits({ onBack }) {
	const [selected, setSelected] = useState(null)
	const [showCustom, setShowCustom] = useState(false)
	const [customAmount, setCustomAmount] = useState('')

	const amounts = ['10', '20', '50', '100', '200']

	function handleAmountClick(value) {
		if (value === 'custom') {
			setShowCustom(true)
			setSelected(null)
		} else {
			setShowCustom(false)
			setCustomAmount('')
			setSelected(value)
		}
	}

	function handleBuy() {
		// For now just go back to previous page per request
		// In a real app, you would process payment here
		if (onBack) onBack()
	}

	const isValidCustom = showCustom
		? customAmount.trim() !== '' && /^\d+(?:\.\d{1,2})?$/.test(customAmount)
		: false

	return (
		<div className='px-5 py-8 w-full mx-auto'>
			<button
				type='button'
				onClick={() => onBack && onBack()}
				className='flex items-center gap-5 mb-8'
			>
				<span>
					<img src='/left-arrow.svg' alt='left-arrow' width={20} />
				</span>
				<div className='font-semibold'>Buy Credits</div>
			</button>
			<section>
				<div className='font-semibold mb-6'>Choose amount</div>
				<div className='grid grid-cols-3 gap-5 text-center mb-4'>
					{amounts.map((a) => (
						<button
							key={a}
							type='button'
							onClick={() => handleAmountClick(a)}
							className={`border border-gray-500 px-5 py-4 rounded-md hover:border-blue-500 hover:text-blue-500 hover:bg-blue-400/20 cursor-pointer font-semibold ${
								selected === a ? 'bg-blue-500/10 border-blue-400 text-blue-300' : ''
							}`}
						>
							${a}
						</button>
					))}
					<button
						type='button'
						onClick={() => handleAmountClick('custom')}
						className={`border border-gray-500 px-5 py-4 rounded-md hover:border-blue-500 hover:text-blue-500 hover:bg-blue-400/20 cursor-pointer font-semibold ${
							showCustom ? 'bg-blue-500/10 border-blue-400 text-blue-300' : ''
						}`}>
						Custom
					</button>
				</div>

				{showCustom && (
					<div className='mb-6 relative'>
						<span className='absolute left-3 top-1/2 -translate-y-1/2 text-white/70'>$</span>
						<input
							value={customAmount}
							onChange={(e) =>
								setCustomAmount(e.target.value.replace(/[^0-9.]/g, ''))
							}
							placeholder='0'
							className='w-full rounded px-3 py-2 pl-8 bg-gray-800 border border-gray-700'
							inputMode='decimal'
						/>
					</div>
				)}

				{/* Contextual Buy button: shown when a preset is selected or Custom was chosen */}
				{(selected || showCustom) && (
					<div className='mt-4'>
						<button
							type='button'
							onClick={handleBuy}
							disabled={showCustom && !isValidCustom}
							className={`w-full py-3 rounded-md font-semibold ${
								showCustom && !isValidCustom
									? 'bg-gray-600 cursor-not-allowed'
									: 'bg-blue-600'
							}`}>
							Buy Credits
						</button>
					</div>
				)}
			</section>
			<section>
				<div className='font-semibold mt-6 mb-5'>Payment method</div>
				<div className='flex items-center gap-3 border border-gray-500 rounded-xl px-4 py-3 mb-6'>
					<img
						src='/visa.svg'
						alt='visa'
						width={60}
						className='rounded-xl overflow-hidden shrink-0'
					/>
					<div className='flex justify-between items-center w-full'>
						<div>
							<div className='flex items-center gap-2 font-medium'>
								Domen Kralj{' '}
								<div className='rounded-lg text-blue-600 bg-blue-200 px-1 py-[0.02rem] text-[0.7rem]'>
									Primary
								</div>
							</div>
							<div className='opacity-50 text-xs mt-0.5'>**** 6775</div>
						</div>
						<button>►</button>
					</div>
				</div>
				<div className='bg-blue-100/15 text-white/70 flex px-4 py-3 rounded-md gap-3 items-start text-sm mb-6'>
					<img src='/information.svg' alt='information' width={18} />
					<p>
						Credit purchase is non-refundable and you agree to our
						<a className='font-semibold'> Terms of service</a>
					</p>
				</div>
			</section>
		</div>
	)
}
