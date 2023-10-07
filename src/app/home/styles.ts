import { Heading, Text, styled } from '@ignite-ui/react'

export const Container = styled('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '$20',
    maxWidth: 'calc(100vw - (100vw - 1160px) / 2)',
    height: '100vh',
    marginLeft: 'auto'
})

export const Hero = styled('div', {
    maxWidth: '480px',
    padding: '0 $10',

    [`> ${Heading}`]: {
        '@media(max-width: 600px)': {
            fontSize: '$6lg'
        }
    },

    [`> ${Text}`]: {
        marginTop: '$2',
        color: '$gray200'
    }
})

export const Preview = styled('div', {
    paddingRight: '$8',
    overflow: 'hidden',

    '@media(max-width: 600px)': {
        display: 'none'
    }
})