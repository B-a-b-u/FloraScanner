# FloraScanner Frontend (React Native)

**FloraScanner** is a mobile application built with React Native that allows users to identify plant species by analyzing images. This project uses a Convolutional Neural Network (CNN) model for image classification and provides detailed information about the identified plant species, including its medicinal properties.

## Features

- User-friendly interface for capturing and uploading plant images.
- Real-time image analysis using a trained Convolutional Neural Network (CNN) model.
- Provides detailed information about identified plant species, including medicinal and ecological benefits.
- Option to save identified plants to a local database for future reference.
- Cross-platform compatibility (iOS and Android).
  
## Tech Stack

- **React Native**: For building the mobile application.
- **Firebase**: For user authentication and storing plant information.
- **TensorFlow**: Used for the CNN model to classify plant species.
- **FastAPI**: Backend to serve the trained model and provide identification results.

## Backend Repo
[Backend Repo](https://github.com/B-a-b-u/FloraScannerApi.git)

## Download APK

You can download the APK of the **FloraScanner** app from the link below:

[Download FloraScanner APK](https://drive.google.com/file/d/10CFdDvwO7A4GwnZm5gEauvPJAEpvNCaQ/view?usp=sharing)

## Installation and Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/B-a-b-u/FloraScanner.git
    cd FloraScanner
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the app on an emulator or connected device:
    ```bash
    npm run android
    # or for iOS
    npm run ios
    ```
## Dataset
- [kaggle](https://www.kaggle.com/datasets/aryashah2k/indian-medicinal-leaves-dataset)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-branch-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Open a pull request.
