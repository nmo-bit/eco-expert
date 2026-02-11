'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { BookUsSchema } from '../utils/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import services from '../utils/services.json';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service: string;
  address: string;
};

const BookUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(BookUsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      address: '',
    },
  });

  async function onSubmit(values: FormValues) {
  setIsSubmitting(true);

  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (data.ok) {
      toast.success('Your booking request has been sent successfully!');
      reset();
    } else {
      toast.error(data.error || 'Something went wrong. Please try again.');
    }
  } catch {
    toast.error('Failed to send booking request. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <div className='py-5'>
      <h2 className='text-xl font-semibold'>We are ready to serve you</h2>
      <p className='mt-4'>
        Please fill out your information, and a representative will contact you
      </p>
      <Divider my={6} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col md:flex-row gap-8'>
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel htmlFor='firstName' fontSize={'14px'}>
              First name
            </FormLabel>
            <Input
              id='firstName'
              placeholder='First name'
              {...register('firstName')}
            />
            <FormErrorMessage>
              {errors.firstName?.message as string}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel htmlFor='lastName' fontSize={'14px'}>
              Last name
            </FormLabel>
            <Input
              id='lastName'
              placeholder='Last name'
              {...register('lastName')}
            />
            <FormErrorMessage>
              {errors.lastName?.message as string}
            </FormErrorMessage>
          </FormControl>
        </div>
        <div className='flex gap-8 flex-col md:flex-row mt-6'>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor='email' fontSize={'14px'}>
              Email address
            </FormLabel>
            <Input
              id='email'
              placeholder='user@domain.com'
              {...register('email')}
            />
            <FormErrorMessage>
              {errors.email?.message as string}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.phone}>
            <FormLabel htmlFor='phone' fontSize={'14px'}>
              Phone number
            </FormLabel>
            <Input
              id='phone'
              placeholder='Phone number'
              {...register('phone')}
            />
            <FormErrorMessage>
              {errors.phone?.message as string}
            </FormErrorMessage>
          </FormControl>
        </div>
        <div className='mt-6'>
          <FormControl isInvalid={!!errors.service}>
            <FormLabel htmlFor='service' fontSize={'14px'}>
              Service
            </FormLabel>
            <Select
              id='service'
              placeholder='Select a service'
              {...register('service', {
                required: 'Kindly select a service',
              })}
            >
              {services.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {errors.service?.message as string}
            </FormErrorMessage>
          </FormControl>
        </div>
        <div className='mt-6'>
          <FormControl isInvalid={!!errors.address}>
            <FormLabel htmlFor='address' fontSize={'14px'}>
              Address
            </FormLabel>
            <Textarea
              id='address'
              placeholder='Please enter your house address'
              {...register('address')}
            />
            <FormErrorMessage>
              {errors.address?.message as string}
            </FormErrorMessage>
          </FormControl>
        </div>
        <button
  className='btn btn-secondary w-full mt-8'
  type='submit'
  disabled={isSubmitting}
>
  {isSubmitting ? 'Sending...' : 'Submit'}
</button>
      </form>
    </div>
  );
};

export default BookUs;
