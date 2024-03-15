/* eslint-disable react/prop-types */
import { useState } from "react";

const SplitString = (props) => {
    const [selectedWord, setSelectedWord] = useState([])
    const word = props.text.split(' ');

    const clickHandle = (obj) => {
        const filteredArray = props.words.filter(item => item.word != obj.word);
        if (props.words.length === filteredArray.length) {
            setSelectedWord([...selectedWord, word[obj.inLine].replace(/[^а-яА-Яa-zA-Z\s]/g, '')])
            props.setJson(props.mergeObjectsWithSameId([...props.words, obj]))
            props.setWord([...props.words, obj])
        } else {
            const filterWord = selectedWord.filter(item => item != obj.word);
            setSelectedWord(filterWord)
            props.setJson(props.mergeObjectsWithSameId(filteredArray))
            props.setWord(filteredArray)
        }
    }
    return (
        <div>
            {word.map((elem, i) => {
                return (
                    <span onClick={() => {
                        clickHandle({
                            inLine: i,
                            idRow: props.index,
                            word: elem.replace(/[^а-яА-Яa-zA-Z\s]/g, '')
                        })
                    }} style={{ marginRight: '5px' }
                    } key={i}>{selectedWord.includes(elem.replace(/[^а-яА-Яa-zA-Z\s]/g, '')) ? <span style={{
                        backgroundColor: 'orange',
                        borderRadius: '10px'
                    }}>{elem}</span> : elem}</span>
                )
            })}
        </div>
    );
}

export default SplitString;