'use client'

import { motion } from 'framer-motion'
import { MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const WHATSAPP_NUMBER = '919890509712'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Swayam%20Agency!%20I%20want%20to%20place%20an%20order%20for%20medical%20equipment.`

const orderSteps = [
  {
    icon: ShoppingBag,
    title: 'Select Your Products',
    description: 'Browse our catalog and choose the medical equipment you need',
  },
  {
    icon: MessageCircle,
    title: 'Chat on WhatsApp',
    description: 'Share your requirements and get a customized quote instantly',
  },
  {
    icon: ArrowRight,
    title: 'Place Your Order',
    description: 'Confirm details and we\'ll process your shipment within 24 hours',
  },
]

export function OrderOnWhatsApp() {
  return null
}
