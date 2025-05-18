# AI LEARNING ASSISTANT CHATBOT USING RAG

Platform using the Retrieval-Augmented Generation (RAG) concept, where user can upload a PDF file, ask any question related to its content, and receive accurate answers extracted from the document.

Used RecursiveCharacterTextSplitter followed by regular expressions to split the text into paragraphs. 
For embeddings, utilized the Hugging Face model intfloat/e5-large-v2 to convert text into vectors, storing them in ChromaDB. 
Experimented with different models like bge-small-en-v1.5 and e5-small-v2 but ultimately chose intfloat/e5-large-v2 for its efficiency.

For retrieval, combined BM25Retriever (for keyword-based retrieval) and Vector Retriever (for semantic-based retrieval)  and used Ensemble retriever to combine both to enhance accuracy. 
The retrieved results were then ranked using a cross-encoder, BAAI/bge-reranker-large. 
Also tested BAAI/bge-reranker-base for faster ranking.

For the LLM, Experimented with DeepSeek R1 and LLaMA 70B (8192 tokens). 
Built the entire pipeline using LangChain, including a prompt template. 
The final output includes the source details (e.g., page number) and response text.
To enable continuous conversation, incorporated memory into the system. Initially, Used LLaMA from Groq Cloud later tried integrating Hugging Face models. 
The entire solution was deployed using a Node.js Express server to provide a chatbot-like experience, with a FastAPI server handling LLM calls and retrieval on the Node.js side.

One optimization explored was reranking sentences within retrieved paragraphs to reduce token usage, which was particularly beneficial when using Groq Cloud due to its token limitations.
Also incorporated a seperate route to upload pdf, and prompt context so that any pdf can be used.



# Instructions before use :

Install node js application into your pc and configure its path.
Then run npm install to run all the node packages.
Current used node packages is labelled in package.json file

Then install all the necessary python packages which is labelled inside requirements_rag.txt.
Recommended to use a virtual environment for that.
Torch,Torchvision,Torchaudio with cuda is optional, can move with normal Torch,Torchvision,Torchaudio.

Run the fast api server by running the main.py file inside classifiers folder.
Always make sure to upload pdf or ask question only after running the fastapi server and then the node server to access the webapp.

It is important to create an account in playground groq or huggingface to generate api keys and use the require models.
The apikeys should be inside the python file names AI_GATEWAYS inside the classifiers folder.

UPLOADING THE PDF WILL SHOW AN ERROR MESSAGE, BUT WILL BE WORKING IN BACKGROUND, CHECK FASTAPI SERVER TO CONFIRM THAT.


