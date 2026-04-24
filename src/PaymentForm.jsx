// https://dribbble.com/shots/23941276-Wallet-Page-Interactions

import React, { useState, useRef, useEffect } from 'react'

export function PaymentForm({ onBuyCredits }) {
	const amounts = ['$10', '$20', '$50', '$100', '$200']
	const [selectedAmount, setSelectedAmount] = useState(amounts[0])
	const [amountOpen, setAmountOpen] = useState(false)
	const [viewAll, setViewAll] = useState(false)
	const [modalMounted, setModalMounted] = useState(false)
	const [modalSlide, setModalSlide] = useState(false)

	// Add card modal states
	const [addCardMounted, setAddCardMounted] = useState(false)
	const [addCardSlide, setAddCardSlide] = useState(false)

	const [fullName, setFullName] = useState('')
	const [country, setCountry] = useState('🇺🇸 United States')
	const [countryOpen, setCountryOpen] = useState(false)
	const [street, setStreet] = useState('')

	const [cardNumber, setCardNumber] = useState('')
	const [expiry, setExpiry] = useState('')
	const [month, shortYear] = expiry.split('/').map(Number)
	const now = new Date()
	const currentFullYear = now.getFullYear()
	const currentMonth = now.getMonth() + 1
	let fullYear = 2000 + shortYear
	const [cvc, setCvc] = useState('')

	const countryOptions = [
		'🇦🇷 Argentina',
		'🇦🇲 Armenia',
		'🇦🇹 Austria',
		'🇧🇪 Belgium',
		'🇨🇦 Canada',
		'🇨🇿 Czech Republic',
		'🇩🇰 Denmark',
		'🇮🇱 Israel',
		'🇮🇹 Italy',
		'🇵🇹 Portugal',
		'🇹🇷 Turkey',
		'🇦🇪 United Arab Emirates',
		'🇬🇧 United Kingdom',
		'🇺🇸 United States',
	]

	const amountRef = useRef(null)
	const scrollYRef = useRef(0)
	const previousBodyStyle = useRef({})

	function openAddCard() {
		setAddCardMounted(true)
		setTimeout(() => setAddCardSlide(true), 10)
	}

	function closeAddCard() {
		setAddCardSlide(false)
		setTimeout(() => {
			setAddCardMounted(false)
			// reset fields optionally
			setFullName('')
			setCountry('🇺🇸 United States')
			setStreet('')
			setCardNumber('')
			setExpiry('')
			setCvc('')
		}, 220)
	}

	function handleAddCardSubmit(e) {
		e.preventDefault()
		// basic validations
		const digitsOnly = cardNumber.replace(/\s+/g, '')
		if (!/^[0-9]{13,19}$/.test(digitsOnly)) {
			alert('Card number must be 13 to 19 digits')
			return
		}
		if (!/^\d{2}\/\d{2}$/.test(expiry)) {
			alert('Expiry must be in MM/YY format')
			return
		}
		if (fullYear > currentFullYear + 10) {
			fullYear -= 100 // превращаем 2090 > 1990
		}
		if (
			month < 1 ||
			month > 12 ||
			fullYear < currentFullYear ||
			(fullYear === currentFullYear && month < currentMonth)
		) {
			alert('Card has expired')
			return
		}
		if (!/^\d{3}$/.test(cvc)) {
			alert('CVC must be exactly 3 digits')
			return
		}
		// on success just close modal for now
		closeAddCard()
		alert('Card added')
	}

	function openViewAll() {
		setViewAll(true)
		setModalMounted(true)
		setTimeout(() => setModalSlide(true), 10)
	}

	function closeViewAll() {
		setModalSlide(false)
		setTimeout(() => {
			setModalMounted(false)
			setViewAll(false)
		}, 250)
	}

	useEffect(() => {
		function handleClick(e) {
			if (amountRef.current && !amountRef.current.contains(e.target)) {
				setAmountOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClick)
		return () => document.removeEventListener('mousedown', handleClick)
	}, [])

	// Lock body scroll when either modal is mounted so only modal can scroll
	useEffect(() => {
		const open = modalMounted || addCardMounted
		if (open) {
			// store current scroll and previous body styles
			scrollYRef.current = window.scrollY || window.pageYOffset || 0
			const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
			previousBodyStyle.current = {
				overflow: document.body.style.overflow,
				paddingRight: document.body.style.paddingRight,
				position: document.body.style.position,
				top: document.body.style.top,
				width: document.body.style.width,
			}
			// prevent background scroll and compensate for scrollbar
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollYRef.current}px`
			document.body.style.left = '0'
			document.body.style.right = '0'
			if (scrollBarWidth > 0) {
				document.body.style.paddingRight = `${scrollBarWidth}px`
			}
			document.body.style.overflow = 'hidden'
		} else {
			// restore previous styles and scroll position
			document.body.style.overflow = previousBodyStyle.current.overflow || ''
			document.body.style.paddingRight = previousBodyStyle.current.paddingRight || ''
			document.body.style.position = previousBodyStyle.current.position || ''
			document.body.style.top = previousBodyStyle.current.top || ''
			document.body.style.width = previousBodyStyle.current.width || ''
			window.scrollTo(0, scrollYRef.current)
		}

		return () => {
			// ensure restoration on unmount
			document.body.style.overflow = previousBodyStyle.current.overflow || ''
			document.body.style.paddingRight = previousBodyStyle.current.paddingRight || ''
			document.body.style.position = previousBodyStyle.current.position || ''
			document.body.style.top = previousBodyStyle.current.top || ''
			document.body.style.width = previousBodyStyle.current.width || ''
		}
	}, [modalMounted, addCardMounted])

	return (
		<div className='p-8 w-full mx-auto'>
			<section className='mb-12'>
				<div className='text-white mb-0.5'>Your balance</div>
				<div className='flex items-center gap-2 mb-3.5'>
					<div className='shadow-2xl bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center'>
						<span className='italic font-bold text-red-400'>V</span>
					</div>
					<div className='text-2xl font-bold'>
						$1,878
						<span className='opacity-50'>.67</span>
					</div>
				</div>
				<button
					type='button'
					onClick={() => onBuyCredits && onBuyCredits()}
					className='bg-blue-700 hover:bg-blue-800 text-white w-full py-2 rounded-md flex items-center justify-center gap-2 font-medium'
				>
					<span>✚</span>
					<span>Buy credits</span>
				</button>
			</section>
			<section className='mb-15'>
				<div className='flex justify-between items-center mb-2.5'>
					<div className='font-semibold'>Payment cards</div>
					<button
						type='button'
						onClick={openAddCard}
						className='font-semibold text-blue-600'
					>
						<span>+ </span>
						<span>Add card</span>
					</button>
				</div>

				{/* Add Card modal (centered) */}
				{addCardMounted && (
					<div className='fixed inset-0 z-50 flex items-end justify-center transition-all duration-800 ease-in-out'>
						<div
							className='absolute inset-0 bg-black/60'
							onClick={closeAddCard}
						/>
						<div
							className={`relative bg-gray-900 text-white w-full max-w-lg mx-4 rounded-lg p-6 transform transition-all duration-200 overflow-auto ${
								addCardSlide
									? 'translate-y-0 opacity-100'
									: 'translate-y-6 opacity-0'
							}`}
							style={{ maxHeight: '80vh', overflowY: 'auto' }}
							>
							<div className='flex items-center justify-between mb-5'>
								<h3 className='font-semibold text-lg'>Add new card</h3>
								<button onClick={closeAddCard} className='text-white/70'>
									✕
								</button>
							</div>
							<form onSubmit={handleAddCardSubmit} className='space-y-4'>
								<div>
									<h4 className='font-medium mb-3'>Personal details</h4>
									<div className='space-y-2 mb-5'>
										<input
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											placeholder='Full name'
											className='w-full rounded px-3 py-2 bg-gray-800 border border-gray-700'
										/>
										<div className='relative'>
											<button
												type='button'
												onClick={() => setCountryOpen((s) => !s)}
												className='w-full text-left rounded px-3 py-2 bg-gray-800 border border-gray-700 flex items-center justify-between'
											>
												<span>{country}</span>
												<span className='opacity-60'>▾</span>
											</button>
											{countryOpen && (
												<ul className='absolute left-0 right-0 mt-1 bg-gray-800 rounded shadow z-30'>
													{countryOptions.map((c) => (
														<li key={c}>
															<button
																type='button'
																onClick={() => {
																	setCountry(c)
																	setCountryOpen(false)
																}}
																className='w-full text-left px-3 py-2 hover:bg-gray-700'
															>
																{c}
															</button>
														</li>
													))}
												</ul>
											)}
										</div>
										<input
											value={street}
											onChange={(e) => setStreet(e.target.value)}
											placeholder='Street address'
											className='w-full rounded px-3 py-2 bg-gray-800 border border-gray-700'
										/>
									</div>
								</div>
								<div>
									<h4 className='font-medium mb-3'>Card details</h4>
									<div className='space-y-2 mb-10'>
										<input
											value={cardNumber}
											onChange={(e) =>
												setCardNumber(e.target.value.replace(/[^0-9\s]/g, ''))
											}
											placeholder='Card number'
											className='w-full rounded px-3 py-2 bg-gray-800 border border-gray-700'
											maxLength={16}
											type='text'
											inputmode='numeric'
										/>
										<div className='flex gap-2'>
											<input
												value={expiry}
												onChange={(e) => {
													let value = e.target.value.replace(/\D/g, '') // оставляем только цифры
													if (value.length > 2) {
														value = value.slice(0, 2) + '/' + value.slice(2, 4)
													}
													setExpiry(value)
												}}
												placeholder='MM/YY'
												className='rounded px-3 py-2 bg-gray-800 border border-gray-700 w-32'
												maxLength={5}
												type='text'
												inputMode='numeric'
											/>
											<input
												value={cvc}
												onChange={(e) =>
													setCvc(
														e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
													)
												}
												placeholder='CVC'
												className='rounded px-3 py-2 bg-gray-800 border border-gray-700 w-20'
												maxLength={3}
												type='text'
												inputmode='numeric'
											/>
										</div>
									</div>
								</div>
								<button
									type='submit'
									className='px-2 py-3 w-full font-medium bg-blue-600 rounded-md'>
									Save card information
								</button>
							</form>
						</div>
					</div>
				)}
				<div className='flex items-center gap-3'>
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
				<div className='flex items-center gap-3 mb-4'>
					<img
						src='/master.svg'
						alt='master'
						width={60}
						className='rounded-xl overflow-hidden shrink-0'
					/>
					<div className='flex justify-between items-center w-full'>
						<div>
							<div className='flex items-center gap-2 font-medium'>
								Domen Kralj{' '}
							</div>
							<div className='opacity-50 text-xs mt-0.5'>**** 3009</div>
						</div>
						<button>►</button>
					</div>
				</div>
				<div className='bg-green-400/20 py-3 px-0.5 rounded-md text-sm flex items-center gap-0.5'>
					<img src='/security.svg' alt='security' width={55} />
					We're fully compliant with the payment card industry data security
					standards.
				</div>
			</section>
			<section className='mb-15'>
				<div className='flex justify-between items-start mb-5 w-full'>
					<div>
						<h3 className='font-semibold mb-2'>Enable auto recharge</h3>
						<p className='opacity-60 w-11/12'>
							Recharge your wallet automatically when the balance is running
							low.
						</p>
					</div>
					<label htmlFor='toggle' className='flex items-center cursor-pointer'>
						<input type='checkbox' id='toggle' className='sr-only peer' />
						<div className='block relative bg-gray-400 w-13 h-7 p-0.5 rounded-full before:absolute before:bg-white before:w-6 before:h-6 before:p-1 before:rounded-full before:transition-all before:ease-in-out before:duration-300 before:left-0.5 peer-checked:before:left-6.5 peer-checked:bg-blue-600'></div>
					</label>
				</div>
				<div className='mb-5' ref={amountRef}>
					<div className='relative w-full'>
						<button
							type='button'
							onClick={() => setAmountOpen((s) => !s)}
							className='w-full bg-white/5 text-white border border-gray-200/10 rounded-md px-4 py-3 flex items-center justify-between gap-2'
						>
							<span className='text-lg'>{selectedAmount}</span>
							<span className='opacity-60'>▾</span>
						</button>
						{amountOpen && (
							<ul className='absolute mt-1 right-0 left-0 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10'>
								{amounts.map((a) => (
									<li key={a}>
										<button
											type='button'
											onClick={() => {
												setSelectedAmount(a)
												setAmountOpen(false)
											}}
											className='w-full text-left text-lg px-3 py-2 hover:bg-gray-700'
										>
											{a}
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
				<div className='text-sm'>
					Your balance will be auto recharged when there is less than 3 minutes
					of the call you are in on your account.
				</div>
			</section>
			<section>
				<div className='flex justify-between items-center mb-8'>
					<div className='font-semibold'>Recent Transactions</div>
					<button
						type='button'
						onClick={openViewAll}
						className='font-semibold text-blue-600'
					>
						<span>View all</span>
						<span> ►</span>
					</button>
				</div>
				<div className='flex flex-col gap-5'>
					<div className='flex justify-between items-center'>
						<div className='flex items-center gap-3'>
							<img src='/woman.png' alt='' width={57} />
							<div>
								<div className='font-semibold'>Tara Johns</div>
								<div className='text-white/50'>Sep 11, 2023, 11:32am</div>
							</div>
						</div>
						<div className='flex flex-col items-end font-semibold'>
							-$114.12
							<span className='text-green-400 font-medium'>Success</span>
						</div>
					</div>
					<div className='flex justify-between items-center'>
						<div className='flex items-center gap-4'>
							<div className='shadow-2xl bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center ml-1'>
								<span className='italic font-bold text-red-400 text-3xl'>
									V
								</span>
							</div>
							<div>
								<div className='font-semibold'>Credits Deposited</div>
								<div className='text-white/50'>Sep 10, 2023, 3:56pm</div>
							</div>
						</div>
						<div className='flex flex-col items-end font-semibold'>
							-$100.00
							<span className='text-green-400 font-medium'>Success</span>
						</div>
					</div>
					<div className='flex justify-between items-center'>
						<div className='flex items-center gap-3'>
							<img src='/man.png' alt='' width={57} />
							<div>
								<div className='font-semibold'>Alex K</div>
								<div className='text-white/50'>Sep 4, 2023, 10:45am</div>
							</div>
						</div>
						<div className='flex flex-col items-end font-semibold'>
							-$90.45
							<span className='text-green-400 font-medium'>Success</span>
						</div>
					</div>
					<div className='flex justify-between items-center'>
						<div className='flex items-center gap-4'>
							<div className='shadow-2xl bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center ml-1'>
								<span className='italic font-bold text-red-400 text-3xl'>
									V
								</span>
							</div>
							<div>
								<div className='font-semibold'>Credits Deposited</div>
								<div className='text-white/50'>Sep 3, 2023, 8:32pm</div>
							</div>
						</div>
						<div className='flex flex-col items-end font-semibold'>
							-$300.00
							<span className='text-green-400 font-medium'>Success</span>
						</div>
					</div>
					<div className='flex justify-between items-center'>
						<div className='flex items-center gap-3'>
							<img src='/woman.png' alt='' width={57} />
							<div>
								<div className='font-semibold'>Tara Johns</div>
								<div className='text-white/50'>Aug 30, 2023, 9:17am</div>
							</div>
						</div>
						<div className='flex flex-col items-end font-semibold'>
							-$178.09
							<span className='text-green-400 font-medium'>Success</span>
						</div>
					</div>
					{modalMounted && (
						<div className='fixed inset-0 z-50 flex items-end justify-center'>
							<div
								className='absolute inset-0 bg-black/60'
								onClick={closeViewAll}
							/>
							<div
								className={`relative w-full max-w-2xl mx-1 bg-gray-900 text-white rounded-t-xl p-5 transition-transform duration-250 ${
									modalSlide ? 'translate-y-0' : 'translate-y-full'
								}`}
								style={{ maxHeight: '70vh', overflowY: 'auto' }}
								>
								<div className='flex items-center justify-between mb-3'>
									<h3 className='font-semibold text-lg'>All Transactions</h3>
									<button onClick={closeViewAll} className='text-white/70'>
										✕
									</button>
								</div>
								<div className='flex flex-col gap-4 overflow-auto py-2'>
									<div className='flex justify-between items-center'>
										<div className='flex items-center gap-3'>
											<img src='/woman.png' alt='' width={57} />
											<div>
												<div className='font-semibold'>Tara Johns</div>
												<div className='text-white/50'>
													Aug 30, 2023, 9:17am
												</div>
											</div>
										</div>
										<div className='flex flex-col items-end font-semibold'>
											-$114.02
											<span className='text-green-400 font-medium'>
												Success
											</span>
										</div>
									</div>
									<div className='flex justify-between items-center'>
										<div className='flex items-center gap-3'>
											<div className='shadow-2xl bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center ml-1'>
												<span className='italic font-bold text-red-400 text-3xl'>
													V
												</span>
											</div>
											<div>
												<div className='font-semibold'>Credits Deposited</div>
												<div className='text-white/50'>Sep 3, 2023, 8:32pm</div>
											</div>
										</div>
										<div className='flex flex-col items-end font-semibold'>
											-$100.00
											<span className='text-green-400 font-medium'>
												Success
											</span>
										</div>
									</div>
									<div className='flex justify-between items-center'>
										<div className='flex items-center gap-3'>
											<img src='/man.png' alt='' width={57} />
											<div>
												<div className='font-semibold'>Alex K</div>
												<div className='text-white/50'>
													Sep 4, 2023, 10:45am
												</div>
											</div>
										</div>
										<div className='flex flex-col items-end font-semibold'>
											-$90.45
											<span className='text-green-400 font-medium'>
												Success
											</span>
										</div>
									</div>
									<div className='flex justify-between items-center'>
										<div className='flex items-center gap-3'>
											<div className='shadow-2xl bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center ml-1'>
												<span className='italic font-bold text-red-400 text-3xl'>
													V
												</span>
											</div>
											<div>
												<div className='font-semibold'>Credits Deposited</div>
												<div className='text-white/50'>Sep 3, 2023, 8:32pm</div>
											</div>
										</div>
										<div className='flex flex-col items-end font-semibold'>
											-$300.00
											<span className='text-green-400 font-medium'>
												Success
											</span>
										</div>
									</div>
									<div className='flex justify-between items-center'>
										<div className='flex items-center gap-3'>
											<img src='/woman.png' alt='' width={57} />
											<div>
												<div className='font-semibold'>Tara Johns</div>
												<div className='text-white/50'>
													Aug 30, 2023, 9:17am
												</div>
											</div>
										</div>
										<div className='flex flex-col items-end font-semibold'>
											-$178.09
											<span className='text-green-400 font-medium'>
												Success
											</span>
										</div>
									</div>
									<div className='flex justify-between items-center'>
										<div className='flex items-center gap-3'>
											<div className='shadow-2xl bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center ml-1'>
												<span className='italic font-bold text-red-400 text-3xl'>
													V
												</span>
											</div>
											<div>
												<div className='font-semibold'>Credits Deposited</div>
												<div className='text-white/50'>Sep 3, 2023, 8:32pm</div>
											</div>
										</div>
										<div className='flex flex-col items-end font-semibold'>
											-$300.00
											<span className='text-green-400 font-medium'>
												Success
											</span>
										</div>
									</div>
									<div className='flex justify-between items-center'>
										<div className='flex items-center gap-3'>
											<img src='/man.png' alt='' width={57} />
											<div>
												<div className='font-semibold'>Alex K</div>
												<div className='text-white/50'>
													Sep 4, 2023, 10:45am
												</div>
											</div>
										</div>
										<div className='flex flex-col items-end font-semibold'>
											-$92.45
											<span className='text-green-400 font-medium'>
												Success
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	)
}
