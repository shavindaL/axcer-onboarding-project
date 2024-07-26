import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


export async function ChatClient({ transcript, selectedText }: { transcript: string, selectedText: string }): Promise<{ message: string }> {

    try {
        console.log("Transcript: ", transcript);
        console.log("Selected Text: ", selectedText);
        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY ?? "",
            modelName: "gpt-4o",
            temperature: 0.5,
        });


        // Prompt template
        const systemTemplate = `
      Your task is to answer the query based on the given selected text. 
        {selected_text}
        Query: {transcript_text}
        Be mindful of the context and provide a relevant answer. And remember to be polite and respectful.
      `
        const prompt = ChatPromptTemplate.fromTemplate(systemTemplate);

        const chain = prompt.pipe(model).pipe(new StringOutputParser());


        const response = await chain.invoke({
            selected_text: selectedText,
            transcript_text: transcript,
        });

        console.log("Response from AI: ", response);
        return {
            message: response,
        };

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in TextToSpeech function: ${error.message} \n ${error.stack}`);
        } else {
            throw new Error(`Error in TextToSpeech function: ${error}`);
        }
    }


}




