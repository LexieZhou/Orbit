// Contextual mock chat history per person

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string; // display string
}

const MESSAGES: Record<string, ChatMessage[]> = {
  "person-sarah": [
    { id: "1", from: "them", text: "Hey! Are you free this weekend? I found this new gallery in Nolita 🎨", time: "Fri 11:02 AM" },
    { id: "2", from: "me",   text: "Yes! I've been meaning to go back to that area. What time?", time: "Fri 11:15 AM" },
    { id: "3", from: "them", text: "Saturday afternoon around 2? We can grab coffee after at La Colombe", time: "Fri 11:18 AM" },
    { id: "4", from: "me",   text: "Perfect. Can't wait 🙌", time: "Fri 11:20 AM" },
    { id: "5", from: "them", text: "Also — I've been seriously thinking about going independent. Can we talk about it too?", time: "Fri 11:22 AM" },
    { id: "6", from: "me",   text: "Of course, that's exciting! Bring your thoughts, I want to hear everything.", time: "Fri 11:25 AM" },
  ],
  "person-marcus": [
    { id: "1", from: "them", text: "Heads up — the architecture review got moved to Thursday", time: "Mon 9:41 AM" },
    { id: "2", from: "me",   text: "Thanks for the heads up. I'll reshuffle my calendar.", time: "Mon 9:55 AM" },
    { id: "3", from: "them", text: "Also, I started that distributed tracing project on the side. Would love your feedback sometime", time: "Mon 10:03 AM" },
    { id: "4", from: "me",   text: "Send me the repo, I'll take a look tonight.", time: "Mon 10:07 AM" },
    { id: "5", from: "them", text: "Done. It's still rough but the core idea is there 🛠️", time: "Mon 10:09 AM" },
  ],
  "person-yuki": [
    { id: "1", from: "me",   text: "I still think about that bike ride in Golden Gate Park 😭 best day", time: "3 days ago" },
    { id: "2", from: "them", text: "Honestly same. I keep looking at the photos. We need to plan another trip!", time: "3 days ago" },
    { id: "3", from: "me",   text: "You're still thinking about moving back east?", time: "3 days ago" },
    { id: "4", from: "them", text: "More seriously now. The SF grind is real. Also I miss having you around", time: "3 days ago" },
    { id: "5", from: "me",   text: "That would make my year honestly 🥹 keep me posted!", time: "3 days ago" },
  ],
  "person-david": [
    { id: "1", from: "me",   text: "Quick question — got a competing offer. Should I use it as leverage or just take it?", time: "Tue 8:15 AM" },
    { id: "2", from: "them", text: "Always use it as leverage first. Even if you plan to take it, you deserve the conversation.", time: "Tue 8:32 AM" },
    { id: "3", from: "me",   text: "That's what I thought. Thanks, David. You always cut through the noise.", time: "Tue 8:35 AM" },
    { id: "4", from: "them", text: "Keep me updated. Let's chat over coffee next week.", time: "Tue 8:37 AM" },
    { id: "5", from: "me",   text: "Absolutely — the usual spot Tuesday?", time: "Tue 8:39 AM" },
    { id: "6", from: "them", text: "Tuesday works. 9am at Bluestone. ☕", time: "Tue 8:41 AM" },
  ],
  "person-elena": [
    { id: "1", from: "me",   text: "Still thinking about last night. You looked so happy at the opening 💛", time: "Yesterday 11:44 PM" },
    { id: "2", from: "them", text: "It was surreal watching people actually stop and look at my work. Thank you for being there 🥺", time: "Yesterday 11:51 PM" },
    { id: "3", from: "me",   text: "You've been working toward that for years. It's just the beginning.", time: "Yesterday 11:53 PM" },
    { id: "4", from: "them", text: "Can we get breakfast tomorrow? I want to talk through next steps with you", time: "Yesterday 11:55 PM" },
    { id: "5", from: "me",   text: "Obviously yes. 9am? I know a place 🍳", time: "Yesterday 11:56 PM" },
    { id: "6", from: "them", text: "It's a date 🌸", time: "Yesterday 11:57 PM" },
  ],
  "person-tom": [
    { id: "1", from: "me",   text: "Hey man, it's been a minute. How are you doing?", time: "2 weeks ago" },
    { id: "2", from: "them", text: "I know, I know. Things have been hectic. Gym has been my only social life lol", time: "2 weeks ago" },
    { id: "3", from: "me",   text: "We should get back to Saturday breakfast. I miss those.", time: "2 weeks ago" },
    { id: "4", from: "them", text: "100%. Let's actually do it this week? No excuses", time: "2 weeks ago" },
    { id: "5", from: "me",   text: "Gregory's at 9. I'm holding you to this 😄", time: "2 weeks ago" },
  ],
  "person-priya": [
    { id: "1", from: "them", text: "The mobile re-launch metrics just came in — 34% improvement in retention 🚀", time: "3 months ago" },
    { id: "2", from: "me",   text: "That's incredible! All that late-night roadmap work paid off.", time: "3 months ago" },
    { id: "3", from: "them", text: "Couldn't have scoped it without you. Genuinely.", time: "3 months ago" },
    { id: "4", from: "me",   text: "Same. Let's grab coffee sometime, even though we're off the project", time: "3 months ago" },
    { id: "5", from: "them", text: "Definitely. I'll reach out when things settle down 🙏", time: "3 months ago" },
  ],
  "person-james": [
    { id: "1", from: "them", text: "Dinner at mom's on Sunday. You coming?", time: "6 weeks ago" },
    { id: "2", from: "me",   text: "Wouldn't miss it. What time?", time: "6 weeks ago" },
    { id: "3", from: "them", text: "6pm. Bring dessert, you know she'll say don't but she always wants it", time: "6 weeks ago" },
    { id: "4", from: "me",   text: "Ha, already on it. How are you doing otherwise? It's been a while since we properly talked", time: "6 weeks ago" },
    { id: "5", from: "them", text: "Honest answer? Been a bit rough. Tell you Sunday.", time: "6 weeks ago" },
    { id: "6", from: "me",   text: "I'm here whenever you want. Sunday and before.", time: "6 weeks ago" },
  ],
};

export function getMessages(personId: string): ChatMessage[] {
  return MESSAGES[personId] ?? [
    { id: "1", from: "them", text: "Hey, hope you're doing well!", time: "Recently" },
    { id: "2", from: "me",   text: "All good here, you?", time: "Recently" },
  ];
}
