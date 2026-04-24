import React, { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PaymentForm } from './PaymentForm.jsx'
import { BuyCredits } from './BuyCredits.jsx'

function AppRouter() {
	const [page, setPage] = useState('payment')

	return (
		<StrictMode>
			{page === 'payment' && (
				<PaymentForm onBuyCredits={() => setPage('buy')} />
			)}
			{page === 'buy' && (
				<BuyCredits onBack={() => setPage('payment')} />
			)}
		</StrictMode>
	)
}

createRoot(document.getElementById('root')).render(<AppRouter />)
