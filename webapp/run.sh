if [ ${ENV} = "DEV" ]; then 
    yarn test
else
    yarn start
fi