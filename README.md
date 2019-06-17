# Setup: 

Install postgres

```
sudo su - postgres
createuser neroark
createdb neoark
```


## Rust:

Install rustup

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Install rust nightly with rls support

```
rustup toolchain add nightly-2019-06-06
rustup default nightly-2019-06-06
rustup component add rls
```

## Diesel:

```
cargo install diesel_cli --no-default-features --features postgres
diesel migration run
```

## Build and run:

### Client:

```
cd client
npm run build
cd ..
```

### Server:

```
cargo run
```

# Go to http://localhost:8000/
