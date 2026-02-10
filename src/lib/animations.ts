export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.6, -0.05, 0.01, 0.99] // Custom easing for "snap" feel
        }
    },
    out: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: 'easeInOut'
        }
    }
}

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

export const listItem = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24
        }
    }
}

export const buttonHover = {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
}

export const buttonTap = {
    scale: 0.95
}
