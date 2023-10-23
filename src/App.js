import { useState } from "react";
import "./App.css"


const initialFacts = [
  {
    id: 1,
    text: 'React is being developed by Meta (formerly facebook)',
    source: 'https://opensource.fb.com/',
    category: 'technology',
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: 'Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%',
    source:
      'https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids',
    category: 'society',
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: 'Lisbon is the capital of Portugal',
    source: 'https://en.wikipedia.org/wiki/Lisbon',
    category: 'society',
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];


const CATEGORIES = [
  { name: 'technology', color: '#3b82f6', id: 1 },
  { name: 'science', color: '#16a34a', id: 2 },
  { name: 'finance', color: '#ef4444', id: 3 },
  { name: 'society', color: '#eab308', id: 4 },
  { name: 'entertainment', color: '#db2777', id: 5 },
  { name: 'health', color: '#14b8a6', id: 6 },
  { name: 'history', color: '#f97316', id: 7 },
  { name: 'news', color: '#8b5cf6', id: 8 },
];

export default function App() {

  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? <NewFactForm /> : null}

      <div className="main">
        <CategoryFilter />
        <FactList />
      </div>
    </>
  )
}

function Header(props) {
  // ? props is an object and hence {showForm, setShowForm} is valid destructuring
  return (
    <header className="header">
      <div className="logo">
        <img
          src="assets/logo.png"
          height="68"
          width="68"
          alt="Today I Learned Logo"
        />
        <h1>Today I Learned</h1>
      </div>

      <button
        className="btn btn-large" type="submit" onClick={() => props.setShowForm((prevShowForm) => !prevShowForm)}>
        {props.showForm ? "CLOSE" : "SHARE A FACT"}
      </button>
    </header>
  )
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories">All</button>
        </li>

        {
          CATEGORIES.map((cat) => (
            <li className="category" key={cat.id}>
              <button
                className="btn btn-category"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </button>
            </li>
          ))
        }

      </ul>
    </aside>
  )
}

function NewFactForm() {

  const [fact, setFact] = useState('')
  const [source, setSource] = useState('')
  const [category, setCategory] = useState('')

  let textLength = fact.length

  function isValidURL(str) {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return regex.test(str)
  }

  function handleSubmit(event) {
    event.preventDefault() // ? Prevents page from reloading when ever a button inside form is clicked 

    // Check form validity
    if (fact && source && category && textLength <= 200) {

      if (isValidURL(source)) {
        // Proceed
      }
      else {
        alert('Enter a Valid URL')
      }

    }
    else {
      alert('Fill all input fields !!')
    }
  }

  return (
    <form className="fact-form" onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={fact}
        onChange={(event) => setFact(event.target.value)}
      />
      <span>{200 - textLength}</span>
      {/* Even though the UI is changing, we do not use states for textLength as it depends upon  fact input field 
          It changes only when the Input field of the fact changes, no need to use states 
      */}
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(event) => setSource(event.target.value)}
      />
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option
            value={cat.name}
            key={cat.id}
            style={{ textTransform: 'capitalize' }}
          >
            {cat.name}
          </option>
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  )
}

const findBGcolor = (category) => {
  return CATEGORIES.find(cat => cat.name === category).color
}

function FactList() {
  const facts = initialFacts
  return (
    <section>
      <ul className="fact-list">
        {
          facts.map((fact) => (
            // <li className="fact" key={fact.id}>
            //   <p>
            //     {fact.text}
            //     <a
            //       className="source"
            //       href={fact.source}
            //       target="_blank"
            //       rel="noopener noreferrer"
            //     >(Source)</a
            //     >
            //   </p>
            //   <span className="tag" style={{ backgroundColor: findBGcolor(fact.category) }}>
            //     {fact.category}
            //   </span>
            //   <div className="vote-buttons">
            //     <button>👍 {fact.votesInteresting}</button>
            //     <button>🤯 {fact.votesMindblowing}</button>
            //     <button>⛔️ {fact.votesFalse}</button>
            //   </div>
            //   <Fact data={fact} />
            // </li>
            <Fact data={fact} key={fact.id} />
          ))
        }
      </ul>
    </section>
  )
}

function Fact(props) {

  const { id, text, source, category, votesInteresting, votesMindblowing, votesFalse } = props.data

  return (

    <li className="fact" key={id}>
      <p>
        {text}
        <a
          className="source"
          href={source}
          target="_blank"
          rel="noopener noreferrer"
        >(Source)</a
        >
      </p>
      <span className="tag" style={{ backgroundColor: findBGcolor(category) }}>
        {category}
      </span>
      <div className="vote-buttons">
        <button>👍 {votesInteresting}</button>
        <button>🤯 {votesMindblowing}</button>
        <button>⛔️ {votesFalse}</button>
      </div>
    </li>

  )
}


