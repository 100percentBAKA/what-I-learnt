import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./App.css"


// const initialFacts = [
//   {
//     id: 1,
//     text: 'React is being developed by Meta (formerly facebook)',
//     source: 'https://opensource.fb.com/',
//     category: 'technology',
//     votesInteresting: 24,
//     votesMindblowing: 9,
//     votesFalse: 4,
//     createdIn: 2021,
//   },
//   {
//     id: 2,
//     text: 'Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%',
//     source:
//       'https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids',
//     category: 'society',
//     votesInteresting: 11,
//     votesMindblowing: 2,
//     votesFalse: 0,
//     createdIn: 2019,
//   },
//   {
//     id: 3,
//     text: 'Lisbon is the capital of Portugal',
//     source: 'https://en.wikipedia.org/wiki/Lisbon',
//     category: 'society',
//     votesInteresting: 8,
//     votesMindblowing: 3,
//     votesFalse: 1,
//     createdIn: 2015,
//   },
// ];


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
  const [facts, setFacts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCategory, setCurrentCategory] = useState('all')

  useEffect(function () {

    async function getFactsFromDB() {
      setIsLoading(true)

      // * Supabase query begins . . .
      let query = supabase.from("facts").select("*")

      if (currentCategory !== "all") query = query.eq("category", currentCategory)

      const { data: facts, error } = await query
        .order('votesInteresting', { ascending: false }) // ? order the fact list w.r.t. to 'votesInteresting' column in descending order
        .limit(1000)

      // const { data: facts, error } = await supabase
      //   .from('facts')
      //   .select('*') // ? select all the columns from the table named 'facts'
      //   .order('votesInteresting', { ascending: false }) // ? order the fact list w.r.t. to 'votesInteresting' column in descending order
      //   .limit(1000) // ? Limit the no of facts to 1000
      // // ! In real world, we implement the concept of pagination while dealing with large volumes of data 

      if (!error) setFacts(facts) // ! Facts array is set here 
      else alert('There was some problem getting the data')
      setIsLoading(false)
    }

    getFactsFromDB()
  }, [currentCategory])

  // ? The function inside the app component renders only once as soon as the app component first renders
  // ? We want to render the facts from supabase DB only once when the app component first renders 
  // ? Hence, the logic to obtain the facts from DB goes inside the useEffect hook
  // ! This function cannot be async ( create another async function inside it ) 

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? <NewFactForm setFactsData={setFacts} setShowFormData={setShowForm} /> : null}

      <div className="main">
        <CategoryFilter setCurrentCategoryData={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} />}
      </div>
    </>
  )
}

function Loader() {
  return (
    <div className="loader">
      <div className="spinner"></div>
    </div>
  );
}

function Header(props) {
  // ? props is an object and hence {showForm, setShowForm} is valid destructuring

  const title = 'FAXXX'

  return (
    <header className="header">
      <div className="logo">
        <img
          src="assets/logo.png"
          height="68"
          width="68"
          alt="Today I Learned Logo"
        />
        <h1>{title}</h1>
      </div>

      <button
        className="btn btn-large" type="submit" onClick={() => props.setShowForm((prevShowForm) => !prevShowForm)}>
        {props.showForm ? "CLOSE" : "SHARE A FACT"}
      </button>
    </header>
  )
}

function CategoryFilter(props) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => props.setCurrentCategoryData('all')}
          >All</button>
        </li>

        {
          CATEGORIES.map((cat) => (
            <li className="category" key={cat.id}>
              <button
                className="btn btn-category"
                style={{ backgroundColor: cat.color }}
                onClick={() => props.setCurrentCategoryData(cat.name)}
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

function NewFactForm(props) {

  const [text, setText] = useState('')
  const [source, setSource] = useState('')
  const [category, setCategory] = useState('')

  let textLength = text.length

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  async function handleSubmit(event) {
    event.preventDefault() // ? Prevents page from reloading when ever a button inside form is clicked 

    // Check form validity
    if (text && source && category && textLength <= 200) {

      if (isValidHttpUrl(source)) {
        // const newFact = {
        //   id: Math.round(Math.random() * 1000),
        //   text: text,
        //   source, // ? source: source equivalent 
        //   category,
        //   votesInteresting: 0,
        //   votesMindblowing: 0,
        //   votesFalse: 0,
        //   createdIn: new Date().getUTCFullYear(),
        // }


        const { data: newFact, error } = await supabase
          .from("facts")
          .insert([{ text, source, category }])
          .select()

        if (!error) props.setFactsData((prevFacts) => [...prevFacts, newFact])

        setText('')
        setSource('')
        setCategory('')

        // Closing the form
        props.setShowFormData(false)
      }
      else {
        alert("Source is not of Valid format !!")
      }

    }
    else {
      alert('Invalid Entry !!')
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(event) => setText(event.target.value)}
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

function FactList({ facts, setFacts }) {

  if (facts.length === 0) {
    return <p>No Facts for this category yet! Create the first one 👌</p>
  }

  return (
    <section>
      <ul className="fact-list">
        {
          facts.map((fact) => (
            <Fact fact={fact} setFacts={setFacts} key={fact.id} />
          ))
        }
      </ul>
    </section>
  )
}

function Fact({ fact, setFacts }) {
  const { id, text, source, category, votesInteresting, votesMindblowing, votesFalse } = fact;
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from('facts')
      .update({ [columnName]: fact[columnName] + 1 })
      .eq('id', fact.id)
      .select();

    if (!error) {
      setFacts((facts) =>
        [...facts].map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    }
    setIsUpdating(false);
  }

  return (
    <li className="fact">
      <p>
        {text}
        <a
          className="source"
          href={source}
          target="_blank"
          rel="noopener noreferrer"
        >(Source)</a>
      </p>
      <span
        className="tag"
      // style={{
      //   backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
      //     .color,
      // }} // ! Above three lines making me cry hard 😭😭😭
      >
        {category}
      </span>
      <div className="vote-buttons">
        <button onClick={() => handleVote('votesInteresting')} disabled={isUpdating}>👍 {votesInteresting}</button>
        <button onClick={() => handleVote('votesMindblowing')} disabled={isUpdating}>🤯 {votesMindblowing}</button>
        <button onClick={() => handleVote('votesFalse')} disabled={isUpdating}>⛔️ {votesFalse}</button>
      </div>
    </li>
  );
}



