if [ ${ENVIRONMENT} = "DEV" ]; then 
    yarn test
else
    yarn start
fi