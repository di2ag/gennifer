'use server'

import { useEffect } from "react"

export const fetchJustification = async (systemContent: string, userContent: string) => {
    console.log(process.env.OPENAI_API_KEY)
    let openaiRequest = {
        model: "gpt-3.5-turbo",
        messages: [{role: 'system', content: systemContent}, { role: 'user', content: userContent }],
        temperature: 0.8,
        max_tokens: 256,
    }
    try {
            const response = await fetch(
                'https://api.openai.com/v1/chat/completions', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + process.env.OPENAI_API_KEY, 
                  },
                cache: 'force-cache',
                body: JSON.stringify(openaiRequest)})
                .then((resp) => {
                    return resp.json()}
                    );
            console.log(response.choices[0]?.message)
            return response.choices[0]?.message.content || '';
        } catch (error) {
            console.error('Error:', error)
        }
    }