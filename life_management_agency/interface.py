import gradio as gr
from life_management_agency.agency import agency
import random

# Sample affirmations
DAILY_AFFIRMATIONS = [
    "I am surrounded by abundance",
    "I create positive change in my life",
    "I am capable of achieving great things",
    "Every day brings new opportunities",
    "I trust in my journey"
]

def get_daily_affirmation():
    return random.choice(DAILY_AFFIRMATIONS)

def create_chat_interface():
    def chat_response(message, history):
        # Process message through agency
        response = agency.process_message(message)
        history.append((message, f"✨ {response}"))
        return "", history

    with gr.Blocks(
        theme=gr.themes.Soft().set(
            body_background_fill="#111827",  # bg-gray-900
            body_text_color="#ffffff",
            button_primary_background_fill="#2563eb",  # bg-blue-600
            button_primary_background_fill_dark="#1d4ed8",
            button_primary_text_color="#ffffff",
            block_title_text_color="#ffffff",
            block_title_background_fill="#1f2937",  # bg-gray-800
            input_background_fill="#374151",  # bg-gray-700
            input_border_color="#4b5563",
            input_border_width="1px",
        ),
        css="""
        .gradio-container {
            font-family: 'Inter', sans-serif !important;
        }
        .chat-message {
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .user-message {
            background-color: #2563eb;
            color: white;
            margin-left: 2rem;
        }
        .bot-message {
            background-color: #1f2937;
            color: white;
            margin-right: 2rem;
        }
        .header-section {
            background-color: rgba(37, 99, 235, 0.1);
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        }
        .affirmation-box {
            background-color: #1f2937;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        }
        .agent-box {
            background-color: #1f2937;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .action-button {
            background-color: #1f2937;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .action-button:hover {
            background-color: #374151;
        }
        .chatbot .user-message {
            background-color: #2563eb !important;
        }
        .chatbot .bot-message {
            background-color: #1f2937 !important;
        }
        """
    ) as interface:
        # Header section with user info
        with gr.Row(elem_classes="header-section"):
            with gr.Column():
                gr.Markdown("👤 Welcome back, User")
            with gr.Column():
                gr.Button("⚙️ Settings", size="sm")

        # Daily Affirmation
        with gr.Row():
            affirmation = gr.Markdown(
                f"""
                ### ✨ Daily Affirmation
                > "{get_daily_affirmation()}"
                """,
                elem_classes="affirmation-box"
            )

        # Quick Actions Grid
        with gr.Row(elem_classes="quick-actions"):
            with gr.Column():
                voice_btn = gr.Button("📞 Voice Call", elem_classes="action-button")
            with gr.Column():
                chat_btn = gr.Button("💬 Chat", elem_classes="action-button")
            with gr.Column():
                wellness_btn = gr.Button("❤️ Wellness", elem_classes="action-button")
            with gr.Column():
                schedule_btn = gr.Button("📅 Schedule", elem_classes="action-button")

        # Available Agents Section
        gr.Markdown("### Your Agents")
        with gr.Row():
            with gr.Column():
                gr.Markdown(
                    """
                    <div class="agent-box">
                        <div>
                            <h4>✨ Master Agent</h4>
                            <p style="color: #9CA3AF;">Available</p>
                        </div>
                        <span>▶️</span>
                    </div>
                    """,
                    elem_id="master-agent"
                )

        # Chat interface
        chatbot = gr.Chatbot(
            value=[],
            height=400,
            show_label=False,
            elem_classes="chatbot"
        )
        
        with gr.Row():
            msg = gr.Textbox(
                placeholder="Type your message here...",
                show_label=False,
                container=False,
                scale=9
            )
            send = gr.Button("Send", scale=1)
        
        # Event handlers
        def refresh_affirmation():
            return f"""
            ### ✨ Daily Affirmation
            > "{get_daily_affirmation()}"
            """

        send.click(
            chat_response,
            inputs=[msg, chatbot],
            outputs=[msg, chatbot],
            api_name="chat"
        )
        msg.submit(
            chat_response,
            inputs=[msg, chatbot],
            outputs=[msg, chatbot]
        )
        
        # Refresh affirmation button
        refresh = gr.Button("🔄 New Affirmation")
        refresh.click(refresh_affirmation, outputs=[affirmation])
        
        # Clear chat history
        clear = gr.Button("Clear Chat")
        clear.click(lambda: None, None, chatbot, queue=False)
        
    return interface

if __name__ == "__main__":
    interface = create_chat_interface()
    interface.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=True
    )
