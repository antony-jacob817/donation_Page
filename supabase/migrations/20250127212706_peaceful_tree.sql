/*
  # Initial Schema Setup for Donation Platform

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - user_type (text) - either 'donor' or 'organization'
      - created_at (timestamp)
    
    - donor_profiles
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - full_name (text)
      - phone_number (text)
      - address (text)
      - donation_preferences (text[])
      - created_at (timestamp)
    
    - organization_profiles
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - organization_name (text)
      - registration_number (text)
      - address (text)
      - head_name (text)
      - verification_status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS donor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  donation_preferences text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE donor_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for Security

CREATE POLICY "Users can insert their own profile"
  ON donor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile"
  ON donor_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON donor_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update the updated_at column on updates
CREATE TRIGGER update_donor_profiles_updated_at
  BEFORE UPDATE
  ON donor_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_donor_profiles_updated_at
  BEFORE UPDATE
  ON donor_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Organization profiles
CREATE TABLE organization_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  organization_name text NOT NULL,
  registration_number text NOT NULL,
  address text NOT NULL,
  head_name text NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizations can read own profile"
  ON organization_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Organizations can update own profile"
  ON organization_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);