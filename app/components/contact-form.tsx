'use client';

import { useState } from 'react';
import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ContactSchema } from '../utils/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import services from '../utils/services.json';
import { toast } from 'react-toastify';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service: string;
  address?: string;
};

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(ContactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      address: '',
    },
  });

  const handleSendAnother = () => {
    setIsSent(false);
    reset();
  };
  
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
        setIsSent(true);
        reset();
      } else {
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Failed to send enquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
  return (
    <div className='bg-white rounded-lg p-6 h-fit text-foreground text-center'>
      <h2 className='text-xl font-semibold'>Contact Information</h2>
      <Divider my={6} />

      <div className='mt-10 flex flex-col items-center'>
        <div className='h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center'>
          <span className='text-2xl'>✈️</span>
        </div>

        <h3 className='mt-6 text-3xl font-semibold'>Thank You!</h3>
        <p className='mt-3 text-gray-600'>
          We&apos;ve received your message and will be in touch soon.
        </p>

        <button
          type='button'
          className='btn btn-outline mt-8'
          onClick={handleSendAnother}
        >
          Send Another Message
        </button>
      </div>
    </div>
  );
}
  
  return (
    <div className='bg-white rounded-lg p-6 h-fit text-foreground'>
      <h2 className='text-xl font-semibold'>Contact Information</h2>
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
