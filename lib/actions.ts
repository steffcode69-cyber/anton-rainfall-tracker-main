'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addRainfallReading(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const amount = parseFloat(formData.get('amount') as string)
  const unit = formData.get('unit') as string
  const date = formData.get('date') as string

  // Convert to mm if the input is in inches
  const amountMm = unit === 'in' ? amount * 25.4 : amount

  const { error } = await supabase
    .from('rainfall_readings')
    .insert({
      amount_mm: amountMm,
      reading_date: date,
      created_by: user.id,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard', 'max')
  revalidatePath('/', 'max')
  return { success: true }
}

export async function deleteRainfallReading(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('rainfall_readings')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard', 'max')
  revalidatePath('/', 'max')
  return { success: true }
}

export async function updateRainfallReading(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const amount = parseFloat(formData.get('amount') as string)
  const unit = formData.get('unit') as string
  const date = formData.get('date') as string

  // Convert to mm if the input is in inches
  const amountMm = unit === 'in' ? amount * 25.4 : amount

  const { error } = await supabase
    .from('rainfall_readings')
    .update({
      amount_mm: amountMm,
      reading_date: date,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard', 'max')
  revalidatePath('/', 'max')
  return { success: true }
}
