import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import { Loader2 } from 'lucide-react'

export default function PayPalButton({ amount, currency, description, onSuccess }) {
  const { profile } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  useEffect(() => {
    if (!window.paypal) {
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=${currency}`
      script.async = true
      script.onload = () => setPaypalLoaded(true)
      document.body.appendChild(script)
    } else {
      setPaypalLoaded(true)
    }
  }, [currency])

  const handlePayment = async (details) => {
    try {
      setLoading(true)

      const paymentId = details.id || details.purchase_units?.[0]?.payments?.captures?.[0]?.id || `pay_${Date.now()}`

      const { data, error } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_expires_at: null,
          paypal_subscription_id: paymentId
        })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error

      toast.success('Premium activated successfully!')
      
      setTimeout(() => {
        if (onSuccess) onSuccess()
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Payment processing error:', error)
      toast.error(`Failed to activate premium: ${error.message}`)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!paypalLoaded || !window.paypal || loading) return

    const paypalButtonContainer = document.getElementById('paypal-button-container')
    if (!paypalButtonContainer) return

    paypalButtonContainer.innerHTML = ''

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount,
              currency_code: currency
            },
            description: description
          }]
        })
      },
      onApprove: async (data, actions) => {
        try {
          const details = await actions.order.capture()
          await handlePayment(details)
        } catch (error) {
          console.error('Payment capture error:', error)
          toast.error('Payment processing failed')
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err)
        toast.error('Payment failed. Please try again.')
      },
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      }
    }).render('#paypal-button-container')
  }, [paypalLoaded, amount, currency, description, loading])

  if (loading) {
          return (
            <div className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
              <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
              <span className="ml-2 text-yellow-400">Processing...</span>
            </div>
          )
  }

  return (
    <div className="w-full">
      <div id="paypal-button-container" className="min-h-[50px]"></div>
    </div>
  )
}

