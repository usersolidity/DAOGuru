## Skill Wallet

**Skill_Wallet** : is used for onboarding members by connecting wallet and joining DAO in the easiest way.

https://github.com/DAO-Guru/DAOGuru/blob/master/src/LendingPage/LendingHeader.js

```javascript
import { InitSwAuth } from "@skill-wallet/auth"; 

const skillWallet=process.env.REACT_APP_SKILL_WALLET;

export default function LendingHeader() {
  const navigate = useNavigate();
  const { authenticate, user, isAuthenticated } = useMoralis(); 
 
  useEffect(() => {
    InitSwAuth();
  }, [user]); 
   return (
   <Box sx={{ flexGrow: 0,display:'flex',justifyContent:'flex-end' }}> 
            <Button
              onClick={agreement}
              variant="outlined"
              style={{ margin: "0 5px" }}
            >
            Dashboard
            </Button>

            <sw-auth  
              partner-key={skillWallet}
              use-dev="true" 
            ></sw-auth>

            {user == null ? (
              <Button
                variant="contained"
                onClick={async () => {
                  await authenticate(); 
                  navigate("/dashboard/Agreement");
                }}
              >
                Connect
              </Button>
            ) : (
              <AccountPopover />
            )}
          </Box>
   )
  }

```

![Screenshot 2022-04-10 at 12 40 09 PM](https://user-images.githubusercontent.com/45895007/162614088-5b16bbab-7de4-4d09-9938-5053d06aa200.png)

