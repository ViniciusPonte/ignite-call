/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Avatar, Heading, Text } from '@ignite-ui/react'
import { Container, UserHeader } from './styles'
import { prisma } from '@/lib/prisma'
import { GetStaticProps, NextPageContext } from 'next'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { ScheduleForm } from './ScheduleForm'

interface ScheduleProps {
  params: {
    username: string
  }
}

interface User {
  name: string
  bio: string
  avatarUrl: string
}

export default function Schedule({ params }: ScheduleProps) {
  const username = params.username

  const [user, setUser] = useState<User>()

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/users/${username}`)
      setUser(res.data.user)
    }

    fetchData()
  }, [username])

  return (
    <Container>
      {user && (
        <UserHeader>
          <Avatar src={user.avatarUrl} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>
      )}

      <ScheduleForm username={username} />
    </Container>
  )
}
