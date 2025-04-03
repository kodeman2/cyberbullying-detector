# Cyberbullying Detection System

A modern web application that detects cyberbullying in text and images using TensorFlow.js and Tesseract.js OCR.

## Features

- Text analysis for cyberbullying detection
- Image analysis with OCR text extraction
- Real-time analysis using TensorFlow.js
- Dark mode support
- Responsive design with Tailwind CSS
- Local storage for analysis history
- Sortable and filterable results table

## Technologies Used

- React.js with Vite
- TensorFlow.js for ML model
- Tesseract.js for OCR
- Tailwind CSS for styling
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cyberbullying-detector
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Text Analysis**:

   - Enter text in the text input area
   - Click "Analyze Text" to check for cyberbullying content

2. **Image Analysis**:

   - Upload an image containing text
   - The app will extract text using OCR
   - Click "Analyze Image" to check for cyberbullying content

3. **View History**:
   - All analyses are saved automatically
   - View past analyses in the history table
   - Sort by date or confidence
   - Filter by result type (Safe/Cyberbullying)

## Model Details

The application uses a simple TensorFlow.js model that analyzes text based on:

- Harmful word detection
- Pattern matching
- Context analysis

Note: This is a demonstration model. For production use, you should:

1. Train a more sophisticated model
2. Use a larger dataset
3. Implement more advanced NLP techniques
4. Add model validation and testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js team for the ML framework
- Tesseract.js team for the OCR library
- Tailwind CSS team for the styling framework
