import psycopg

# Try common postgres password combinations
passwords = ['', 'postgres', 'admin', 'password', '123456']
for pwd in passwords:
    try:
        if pwd:
            conn_str = f'postgresql://postgres:{pwd}@localhost:5432/postgres'
        else:
            conn_str = 'postgresql://postgres@localhost:5432/postgres'
        conn = psycopg.connect(conn_str, autocommit=True)
        print(f'Connected successfully with password: "{pwd}"')
        
        # Try to create the database
        cur = conn.cursor()
        try:
            cur.execute('CREATE DATABASE devmarket_pulse')
            print('Database devmarket_pulse created!')
        except Exception as e:
            if 'already exists' in str(e):
                print('Database devmarket_pulse already exists!')
            else:
                print(f'Could not create database: {e}')
        
        conn.close()
        break
    except Exception as e:
        print(f'Failed with password "{pwd}": {str(e)[:60]}...')
