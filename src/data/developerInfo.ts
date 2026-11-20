export interface SocialProfile {
  id: string;
  platform: string;
  username: string;
  url: string;
  color: string;
  isDiscord?: boolean;
}

export const DEVELOPER_INFO = {
  fullName: 'Hazim Bashir',
  urduName: 'حازم بشیر',
  username: '@officialhazim42',
  discordUsername: 'officialhazim42',
  role: 'Android Developer & Software Creator',
  location: 'Ganderbal, Jammu & Kashmir, India',
  email: 'hazimbashir.dev@gmail.com',
  image: '/hazim-bashir-dev.png',
  imageAlt: 'Hazim Bashir - Official HB Developer Branding',
  bio: `Hi, I'm Hazim Bashir (حازم بشیر), an independent software developer from Ganderbal, Jammu & Kashmir, India. I enjoy designing and developing modern, high-performance, user-friendly digital experiences and software solutions. My focus is on creating clean interfaces, practical digital utilities, privacy-conscious applications, and reliable software experiences. My mission is to make useful technology accessible to everyone through simple, powerful, and privacy-friendly digital solutions.`,
  projectContext: `LifeTools is an open client-side digital utility platform built with React 18, TypeScript, Tailwind CSS, and Vite. All computations, conversions, and cryptographic operations run locally on your device with zero server uploads.`,
  specializations: [
    'Android Development',
    'Kotlin & Jetpack Compose',
    'Software Development',
    'Digital Utility Solutions',
    'Client-Side Web Architectures'
  ],
  footerNote: 'Crafted with care by Hazim Bashir (حازم بشیر) in Kashmir.'
};

export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    id: 'github',
    platform: 'GitHub',
    username: '@officialhazim42',
    url: 'https://github.com/officialhazim42',
    color: 'hover:text-slate-900 dark:hover:text-white'
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    username: 'hazim-bashir-faqeer',
    url: 'https://www.linkedin.com/in/hazim-bashir-faqeer',
    color: 'hover:text-[#0A66C2]'
  },
  {
    id: 'x',
    platform: 'X (Twitter)',
    username: '@officialhazim42',
    url: 'https://x.com/officialhazim42',
    color: 'hover:text-slate-900 dark:hover:text-white'
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    username: '@officialhazim42',
    url: 'https://instagram.com/officialhazim42',
    color: 'hover:text-[#E4405F]'
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    username: '@officialhazim42',
    url: 'https://youtube.com/@officialhazim42',
    color: 'hover:text-[#FF0000]'
  },
  {
    id: 'discord',
    platform: 'Discord',
    username: 'officialhazim42',
    url: 'https://discord.com/users/officialhazim42',
    color: 'hover:text-[#5865F2]',
    isDiscord: true
  },
  {
    id: 'telegram',
    platform: 'Telegram',
    username: '@officialhazim42',
    url: 'https://t.me/officialhazim42',
    color: 'hover:text-[#229ED9]'
  },
  {
    id: 'threads',
    platform: 'Threads',
    username: '@officialhazim42',
    url: 'https://www.threads.net/@officialhazim42',
    color: 'hover:text-slate-900 dark:hover:text-white'
  },
  {
    id: 'reddit',
    platform: 'Reddit',
    username: 'u/officialhazim42',
    url: 'https://www.reddit.com/user/officialhazim42',
    color: 'hover:text-[#FF4500]'
  },
  {
    id: 'snapchat',
    platform: 'Snapchat',
    username: '@officialhazim42',
    url: 'https://www.snapchat.com/add/officialhazim42',
    color: 'hover:text-[#FFFC00]'
  }
];
