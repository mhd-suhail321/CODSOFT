import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# 1. SETUP PATHS
base_path = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(base_path, 'IMDb_Movies_India.csv')

try:
    df = pd.read_csv(file_path, encoding='latin-1')
    print("✅ Dataset Loaded Successfully!")

    # 2. DATA CLEANING
    def clean_movie_data(df):
        df.dropna(subset=['Rating'], inplace=True)
        df['Year'] = df['Year'].str.extract('(\d+)').astype(float)
        df['Duration'] = df['Duration'].str.extract('(\d+)').astype(float)
        df['Duration'] = df['Duration'].fillna(df['Duration'].median())
        df['Votes'] = df['Votes'].str.replace(',', '').astype(float)
        df['Votes'] = df['Votes'].fillna(df['Votes'].median())
        df['Genre'] = df['Genre'].str.split(',').str[0]
        return df

    df_clean = clean_movie_data(df)

    # 3. TARGET ENCODING (FIXED VERSION)
    def encode_features(df):
        features = ['Genre', 'Director', 'Actor 1', 'Actor 2', 'Actor 3']
        encoded_cols = []
        for feature in features:
            col_name = f"{feature}_encoded"
            # Replace name with the average rating of their movies
            feature_mean = df.groupby(feature)['Rating'].transform('mean')
            df[col_name] = feature_mean
            encoded_cols.append(col_name)
        
        # Fill missing values ONLY in the new numerical columns
        global_mean = df['Rating'].mean()
        for col in encoded_cols:
            df[col] = df[col].fillna(global_mean)
        return df

    df_encoded = encode_features(df_clean)

    # 4. DEFINE FEATURES AND TARGET
    X = df_encoded[['Year', 'Duration', 'Votes', 'Genre_encoded', 
                    'Director_encoded', 'Actor 1_encoded', 'Actor 2_encoded', 'Actor 3_encoded']]
    y = df_encoded['Rating']

    print("✅ Features extracted. Starting training...")

    # 5. MODEL TRAINING
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    # 6. EVALUATION
    y_pred = model.predict(X_test)
    print(f"\n--- Model Performance ---")
    print(f"Mean Squared Error: {mean_squared_error(y_test, y_pred):.4f}")
    print(f"R2 Score: {r2_score(y_test, y_pred):.4f}")

    # 7. SAVE MODEL
    joblib.dump(model, 'movie_rating_model.pkl')
    print("\n✅ Model saved as 'movie_rating_model.pkl'!")

except FileNotFoundError:
    print(f"❌ Error: Could not find 'IMDb_Movies_India.csv' at {file_path}")
except Exception as e:
    print(f"❌ An error occurred: {e}")

import matplotlib.pyplot as plt
import seaborn as sns

# Get Feature Importances
importances = model.feature_importances_
feature_names = X.columns
feature_importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)

# Plot
plt.figure(figsize=(10, 6))
sns.barplot(x='Importance', y='Feature', data=feature_importance_df, palette='viridis')
plt.title('Key Factors Influencing Movie Ratings')
plt.tight_layout()
plt.savefig('feature_importance.png') # Saves the chart for your report
plt.show()

print("✅ Visualization saved as 'feature_importance.png'")