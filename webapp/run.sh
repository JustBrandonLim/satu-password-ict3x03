if [ "${ENVIRONMENT}" = "DEV" ]; then
    yarn dev
elif [ "${ENVIRONMENT}" = "TEST" ]; then
    yarn test
else
    yarn start
fi