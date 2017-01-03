import PollList from './PollList'

function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a
}

let polls = [
  {
    title: "Your favorite frontend javascript framework",
    options: [
      "React",
      "Angular",
      "Ember",
      "Aurelia",
      "Vue.js",
    ],
  },
  {
    title: "Best movie of 2016",
    options: [
      "Arrival",
      "Nocturnal Animals",
      "The Witch",
      "The Finest Hours",
      "Neon Demon",
      "Swiss Army Man",
      "Sausage Party",
      "Split",
      "Chronic",
    ],
  },
  {
    title: "Must Read Computer Science Book",
    options: [
      "Introduction to Algorithms",
      "The C Programming Language",
      "Cracking the Coding Interview",
      "Structure and Interpretation of Computer Programs",
      "Clean Code by Robert C. Martin",
      "Algorithms by Robert Sedgewick",
      "Pragmatic Programmer",
      "Patterns of Enterprise Application Architecture",
    ],
  },
  {
    title: "Best Coding Practice Website",
    options: [
      "Project Euler",
      "Leetcode",
      "Topcoder",
    ],
  },
  {
    title: "Best Roguelike Game",
    options: [
      "Dungeon Crawl Stone Soup",
      "Cataclysm: Dark Days Ahead",
      "Cogmind",
      "Caves of Qud",
      "Nethack",
    ],
  },
  {
    title: "Favorite Soft Drink",
    options: [
      "Cola",
      "Fanta",
      "Sprite",
      "Mountain Dew",
    ],
  },
  {
    title: "Best Material Design Library for React",
    options: [
      "Material UI",
      "react-md",
      "React Toolbox",
    ]
  },
  {
    title: "Best CSS framework",
    options: [
      "Bootstrap",
      "Foundation",
      "Semantic",
    ]
  },
  {
    title: "Code Editor of your choice",
    options: [
      "Emacs",
      "VIM",
      "Nano",
      "Webstorm",
      "Atom",
      "c9",
    ],
  },
  {
    title: "Hosting for static sites",
    options: [
      "Github Pages",
      "Surge",
      "Codepen",
      "Heroku",
      "Hyperdev",
    ],
  },
  {
    title: "Best Freelance Platform",
    options: [
      "Freelancer.com",
      "Toptal",
      "UpWork",
      "Friends and Family",
    ],
  },
]

polls = shuffle(polls.map(poll => ({...poll, options: shuffle(poll.options)})))

export default (props) => PollList({
  ...props,
  polls,
})