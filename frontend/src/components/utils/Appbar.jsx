import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";
import HomeIcon from "@mui/icons-material/Home";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FeedIcon from "@mui/icons-material/Feed";
import useGetManyFeeds from "../hooks/useGetManyFeeds";

import useGetSearch from "../hooks/useGetSearch";
import { useDebouncedCallback } from "use-debounce";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import PeopleIcon from "@mui/icons-material/People";
import {
  Autocomplete,
  Badge,
  Chip,
  CircularProgress,
  Collapse,
  InputBase,
  Stack,
  ListSubheader,
  TextField,
  Tooltip,
  useColorScheme,
  Grid,
  createFilterOptions,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import UserAvatar from "./UserAvatar";
import useFriendsRequestActions from "../hooks/useFriendsRequestActions";
import ExpandIcon from "./ExpandIcon";
import useChatRoomInviteAction from "../hooks/useChatRoomInviteAction";
import useInviteToChatRoom from "../hooks/useInviteToChatRoom";
import useGetSearchUsers from "../hooks/useGetSearchUsers";
import useSendFriendRequest from "../hooks/useSendFriendRequest";
import useEditUser from "../hooks/useEditUser";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar({
  User,
  refetch,
  setseverity,
  setmessage,
}) {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  const feeds = useGetManyFeeds();

  const [search, setSearch] = useState(null);
  const { data } = useGetSearch({ search });
  const [friendsaction] = useFriendsRequestActions();
  const [chatinviteaction] = useChatRoomInviteAction();
  const [InviteToChatRoom] = useInviteToChatRoom();
  const [SendFriendRequest] = useSendFriendRequest();
  const [edituser] = useEditUser();

  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [loginanchorEl, setLoginAnchorEl] = useState(null);
  const [notificationanchorEl, setNotificationAnchorEl] = useState(null);
  const [friendsanchorEl, setFriendsAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isLoginMenuOpen = Boolean(loginanchorEl);
  const isNotificationPopperOpen = Boolean(notificationanchorEl);
  const isFriendsMenuOpen = Boolean(friendsanchorEl);

  const menuId = "primary-search-account-menu";
  const loginMenuId = "login-menu";
  const notificationId = "notification-menu";
  const friendsmenuId = "Friends-Menu";

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  const handleLoginMenuOpen = (event) => {
    setLoginAnchorEl(event.currentTarget);
  };
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoginMenuClose = () => {
    setLoginAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFriendsMenuOpen = (event) => {
    setFriendsAnchorEl(event.currentTarget);
  };
  const handleFriendsMenuClose = () => {
    setFriendsAnchorEl(null);
  };

  const handleProfileMenuClick = () => {
    navigate(`/profile/${User.id}`);
    handleMenuClose();
  };
  const handleMyaccountClick = () => {
    navigate("/myaccount");
    handleMenuClose();
  };
  const handleLoginClick = () => {
    navigate("/login");
    handleLoginMenuClose();
  };
  const handleLogoutClick = () => {
    handleMenuClose();
    localStorage.setItem("HomeorderBy", "POPULAR");
    localStorage.setItem("FeedorderBy", "POPULAR");
    sessionStorage.clear();

    navigate("/");
  };
  const handleRegisterClick = () => {
    navigate("/register");
    handleLoginMenuClose();
  };
  const handleHomeClick = () => {
    navigate("/");
  };
  const handleMakeNewFeedClick = () => {
    navigate("/makefeed");
  };

  const debounced = useDebouncedCallback((value) => {
    setSearch(value);
  }, 1000);

  const UserSearchItem = ({ setSelectedUser, SelectedUser }) => {
    const [SearchUsers, setSearchUsers] = useState("");

    const { data } = useGetSearchUsers({
      search: SearchUsers,
    });
    const filterOptions = createFilterOptions({
      limit: 10,
    });
    const debouncedUsers = useDebouncedCallback((value) => {
      setSearchUsers(value);
    }, 1000);

    const searchoptions = data ? data.getsearchusers : [];
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "100%",
        }}
      >
        <Autocomplete
          disablePortal
          filterOptions={filterOptions}
          value={SelectedUser}
          sx={{ minWidth: "100%" }}
          options={searchoptions}
          getOptionLabel={(option) => `${option.username}`}
          getOptionKey={(option) => option.username}
          renderOption={(params, option) => (
            <Typography {...params}>{option.username}</Typography>
          )}
          renderInput={(params) => (
            <TextField
              sx={{
                minWidth: "90%",
                input: { color: "inherit" },
                label: { color: "inherit" },
              }}
              size="small"
              {...params}
              onChange={(e) => debouncedUsers(e.target.value)}
              label="Search"
            />
          )}
          onChange={(event, newValue) => {
            setSelectedUser(newValue);
          }}
        />
      </Box>
    );
  };
  const ThemeState = () => {
    const { mode, setMode } = useColorScheme();

    if (!mode) {
      return null;
    }
    return (
      <Box>
        <select
          value={mode}
          onChange={(event) => {
            setMode(event.target.value);
          }}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </Box>
    );
  };
  const MenuStatelogin = ({ User }) => {
    if (User) {
      return (
        <Menu
          sx={{ borderRadius: 5 }}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          id={menuId}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem sx={{ borderRadius: 5 }} onClick={handleProfileMenuClick}>
            <PersonIcon></PersonIcon>Profile
          </MenuItem>
          <MenuItem sx={{ borderRadius: 5 }} onClick={handleMyaccountClick}>
            <AccountBoxIcon></AccountBoxIcon>My account
          </MenuItem>
          <MenuItem sx={{ borderRadius: 5 }} onClick={handleLogoutClick}>
            <LogoutIcon></LogoutIcon>Logout
          </MenuItem>
        </Menu>
      );
    } else {
      return (
        <Menu
          anchorEl={loginanchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          id={loginMenuId}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={isLoginMenuOpen}
          onClose={handleLoginMenuClose}
        >
          <MenuItem onClick={handleLoginClick}>
            <LoginIcon></LoginIcon>Login
          </MenuItem>
          <MenuItem onClick={handleRegisterClick}>
            <LoginIcon></LoginIcon>Register
          </MenuItem>
        </Menu>
      );
    }
  };
  const MenupopularState = ({ feeds }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <ListItem key="popularfeeds" disablePadding>
          <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <FeedIcon />
            </ListItemIcon>
            <ListItemText primary={"Popular feeds"} />
            <ListItemIcon>
              <ExpandIcon Open={open}></ExpandIcon>
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <Collapse in={open}>
          {feeds.map((feed) => (
            <ListItem
              onClick={toggleDrawer(false)}
              key={feed.feedname}
              disablePadding
            >
              <ListItemButton
                sx={{ borderRadius: 5 }}
                onClick={() => {
                  navigate(`/feed/${feed.feedname}`);
                }}
              >
                <ListItemText primary={feed.feedname} />
              </ListItemButton>
            </ListItem>
          ))}
        </Collapse>
      </>
    );
  };
  const MenusubsState = ({ User }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <ListItem key="subscribedfeeds" disablePadding>
          <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <FeedIcon />
            </ListItemIcon>
            <ListItemText primary={"Subscribed feeds"} />
            <ListItemIcon>
              <ExpandIcon Open={open}></ExpandIcon>
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <Collapse in={open}>
          {User.feedsubs ? (
            User.feedsubs.map((subs) => (
              <ListItem
                onClick={toggleDrawer(false)}
                key={subs.feedname}
                disablePadding
              >
                <ListItemButton
                  sx={{ borderRadius: 5 }}
                  onClick={() => {
                    navigate(`/feed/${subs.feedname}`);
                  }}
                >
                  <ListItemText primary={subs.feedname} />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography>Not subscribed to any feeds.</Typography>
          )}
        </Collapse>
      </>
    );
  };

  const MenuOwnedState = ({ User }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <ListItem key="ownedfeeds" disablePadding>
          <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <FeedIcon />
            </ListItemIcon>
            <ListItemText primary={"Owned feeds"} />
            <ListItemIcon>
              <ExpandIcon Open={open}></ExpandIcon>
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <Collapse in={open}>
          {User.ownedfeeds ? (
            User.ownedfeeds.map((feed) => (
              <ListItem
                onClick={toggleDrawer(false)}
                key={feed.feedname}
                disablePadding
              >
                <ListItemButton
                  sx={{ borderRadius: 5 }}
                  onClick={() => {
                    navigate(`/feed/${feed.feedname}`);
                  }}
                >
                  <ListItemText primary={feed.feedname} />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography>No owned feeds</Typography>
          )}
        </Collapse>
      </>
    );
  };

  const DrawerState = ({ User }) => {
    const popularfeeds = feeds.data ? feeds.data.getfeed : [];

    if (feeds.loading) {
      return <CircularProgress color="inherit"></CircularProgress>;
    }

    if (User) {
      return (
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem key="makefeed" disablePadding>
              <ListItemButton onClick={handleMakeNewFeedClick}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary={"Make new feed"} />
              </ListItemButton>
            </ListItem>
            <Divider />

            <MenuOwnedState User={User}></MenuOwnedState>

            <Divider />

            <MenusubsState User={User}></MenusubsState>
            <Divider></Divider>

            <MenupopularState feeds={popularfeeds}></MenupopularState>
            <Divider></Divider>
          </List>
        </Box>
      );
    } else {
      return (
        <Box sx={{ width: 250 }} role="presentation">
          <MenupopularState feeds={popularfeeds}></MenupopularState>
          <Divider></Divider>
        </Box>
      );
    }
  };
  const FriendsMenu = ({ User }) => {
    if (!User) {
      return;
    }
    return (
      <>
        <IconButton
          onClick={handleFriendsMenuOpen}
          size="small"
          edge="end"
          aria-label="friendsmenu"
          aria-controls={friendsmenuId}
          aria-haspopup="true"
          color="inherit"
          className="button"
          sx={{ borderRadius: 50 }}
        >
          <PeopleIcon />
        </IconButton>

        <Drawer
          anchor="right"
          id={friendsmenuId}
          keepMounted
          open={isFriendsMenuOpen}
          onClose={handleFriendsMenuClose}
          sx={{ padding: 5 }}
        >
          <MenufriendsState User={User}></MenufriendsState>
        </Drawer>
      </>
    );
  };
  const MenufriendsState = ({ User }) => {
    const [SelectedUser, setSelectedUser] = useState(null);
    const [OpenAddFriend, setOpenAddFriend] = useState(false);
    const Frienditem = ({ item, User }) => {
      const [Open, setOpen] = useState(false);
      const [OpenChatInvite, setOpenChatInvite] = useState(false);

      return (
        <>
          <Box key={item.id} sx={{ width: 250 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setOpen(!Open)}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={item.username} />
                <ListItemIcon>
                  <ExpandIcon Open={Open}></ExpandIcon>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <Collapse key={item.username} in={Open}>
              <Stack direction={"column"} sx={{ textAlign: "center" }}>
                <Typography>Actions:</Typography>
                <Divider></Divider>
                <Button onClick={() => navigate(`/profile/${item.id}`)}>
                  Go to profile
                </Button>
                <Button
                  onClick={() => {
                    setOpenChatInvite(!OpenChatInvite);
                  }}
                >
                  invite to chatroom{" "}
                  <ExpandIcon Open={OpenChatInvite}></ExpandIcon>
                </Button>
                <Collapse
                  in={OpenChatInvite}
                  key={item.username + "chatinvite"}
                >
                  {User.chatrooms ? (
                    User.chatrooms.map((chatitem) => (
                      <Button
                        onClick={() => {
                          try {
                            InviteToChatRoom({
                              roomId: chatitem.id,
                              invitedId: item.id,
                            });
                            setseverity("success");
                            setmessage(
                              `Friend ${item.username} invited to ${chatitem.name}`
                            );
                          } catch (error) {
                            setmessage(error.message);
                            setseverity("error");
                          }
                        }}
                      >
                        {chatitem.name}
                      </Button>
                    ))
                  ) : (
                    <Typography>No chatrooms to invite to.</Typography>
                  )}
                </Collapse>
                <Button
                  onClick={() => {
                    edituser({ content: item.id, type: "removefriend" });
                  }}
                >
                  Remove friend
                </Button>
              </Stack>
            </Collapse>
          </Box>
        </>
      );
    };
    return (
      <Box role="presentation">
        <Divider></Divider>
        <ListItemButton
          onClick={() => setOpenAddFriend(!OpenAddFriend)}
          key="addfriends"
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>

          <ListItemText primary={"Add Friends"} />
          <ListItemIcon>
            <ExpandIcon Open={OpenAddFriend}></ExpandIcon>
          </ListItemIcon>
        </ListItemButton>
        <Collapse key={"AddfriendCollapse"} in={OpenAddFriend}>
          <UserSearchItem
            setSelectedUser={setSelectedUser}
            SelectedUser={SelectedUser}
          ></UserSearchItem>
          <Button
            className="button"
            sx={{ borderRadius: 50 }}
            onClick={() => {
              SendFriendRequest({ userId: SelectedUser.id });
              setseverity("success");
              setmessage(`Friend request sent to ${SelectedUser.username}`);
              setSelectedUser(null);
            }}
            size="small"
            variant="outlined"
            color="inherit"
          >
            Add
          </Button>
        </Collapse>
        <Divider></Divider>

        <List>
          <ListItem key="friends">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"Friends"} />
          </ListItem>
          <Divider></Divider>
          {User.friends ? (
            User.friends.map((item) => (
              <Frienditem item={item} User={User}></Frienditem>
            ))
          ) : (
            <Typography>No friends :/.</Typography>
          )}
        </List>
      </Box>
    );
  };
  const MenuState = MenuStatelogin({ User });
  const DrawerList = DrawerState({ User });

  const Renderloginstate = ({ User }) => {
    if (!User) {
      return (
        <Box sx={{ display: { md: "flex" } }}>
          <IconButton
            size="small"
            edge="end"
            aria-label="login"
            aria-controls={loginMenuId}
            aria-haspopup="true"
            onClick={handleLoginMenuOpen}
            color="inherit"
          >
            <AccountCircle fontSize="large" />
          </IconButton>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: { md: "flex" } }}>
          <IconButton
            size="small"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <UserAvatar user={User} height={35} width={35}></UserAvatar>
          </IconButton>
        </Box>
      );
    }
  };
  const searchoptions = data ? data.getsearchbar : [];

  const NotificationsState = ({ User }) => {
    if (!User) {
      return;
    }
    const friendsRequests = User.friendsRequests;
    const chatinvites = User.chatroominvites;
    return (
      <>
        <IconButton
          size="small"
          edge="end"
          aria-label="notifications"
          aria-controls={notificationId}
          aria-haspopup="true"
          onClick={handleNotificationMenuOpen}
          color="inherit"
        >
          <Badge
            badgeContent={friendsRequests.length + chatinvites.length}
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </>
    );
  };
  const MenuNotificationsState = ({ User }) => {
    if (!User) {
      return;
    }
    const FriendRequests = ({ User }) => {
      if (User.friendsRequests.length > 0) {
        return (
          <>
            <Typography>Friends requests</Typography>
            {User.friendsRequests.map((item) => {
              return (
                <MenuItem sx={{ borderRadius: 5 }}>
                  <Typography onClick={() => navigate(`/profile/${item.id}`)}>
                    {item.username}
                  </Typography>
                  <Tooltip title="accept">
                    <IconButton
                      onClick={() =>
                        friendsaction({
                          type: "accept",
                          userId: item.id,
                        })
                      }
                      size="small"
                    >
                      <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="decline">
                    <IconButton
                      onClick={() =>
                        friendsaction({
                          type: "decline",
                          userId: item.id,
                        })
                      }
                      size="small"
                    >
                      <NotInterestedIcon></NotInterestedIcon>
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              );
            })}
          </>
        );
      }
      if (User.chatroominvites.length + User.friendsRequests.length == 0) {
        return <Typography>No notifications</Typography>;
      }
      return;
    };
    const ChatInvites = ({ User }) => {
      if (User.chatroominvites.length > 0) {
        return (
          <>
            <Typography>Chat invites</Typography>
            {User.chatroominvites.map((item) => {
              return (
                <MenuItem sx={{ borderRadius: 5 }}>
                  <Typography>{item.name}</Typography>
                  <Tooltip title="accept">
                    <IconButton
                      onClick={() =>
                        chatinviteaction({
                          type: "accept",
                          roomId: item.id,
                        })
                      }
                      size="small"
                    >
                      <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="decline">
                    <IconButton
                      onClick={() =>
                        chatinviteaction({
                          type: "decline",
                          roomId: item.id,
                        })
                      }
                      size="small"
                    >
                      <NotInterestedIcon></NotInterestedIcon>
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              );
            })}
          </>
        );
      }
      return;
    };
    return (
      <Menu
        anchorEl={notificationanchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        id={notificationId}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={isNotificationPopperOpen}
        onClose={handleNotificationMenuClose}
        sx={{ padding: 5 }}
      >
        <Stack
          direction={"column"}
          sx={{
            display: "flex",
            padding: 1,
            borderRadius: 5,
            textAlign: "center",
          }}
        >
          <FriendRequests User={User}></FriendRequests>
          <ChatInvites User={User}></ChatInvites>
        </Stack>
      </Menu>
    );
  };

  const NotificationState = MenuNotificationsState({ User });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ marginBottom: "64px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid container key={"appbar-left"}>
            <IconButton
              onClick={toggleDrawer(true)}
              size="medium"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>

            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="Home button"
              sx={{ mr: 2 }}
              onClick={handleHomeClick}
            >
              <HomeIcon />
            </IconButton>
          </Grid>
          <Grid
            key={"appbar-center"}
            container
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Box
              sx={{ display: "flex" }}
              size={{ xs: 0, sm: 2, md: 3, lg: 4, xl: 6 }}
            >
              <Autocomplete
                disablePortal
                options={searchoptions}
                getOptionLabel={(option) => `f/${option.feedname}`}
                getOptionKey={(option) => option}
                groupBy={(option) => option.__typename}
                freeSolo
                filterOptions={(x) => x}
                size="small"
                renderOption={(option) => {
                  if (option.key.__typename == "Feed") {
                    return (
                      <li key={option.key.id}>
                        <Button
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            textAnchor: "left",
                          }}
                          onClick={() => {
                            navigate(`/feed/${option.key.feedname}`);
                          }}
                        >
                          <Typography
                            textAlign={"left"}
                            sx={{ textAlign: "left", width: "100%" }}
                          >
                            {option.key.feedname}
                          </Typography>
                        </Button>
                      </li>
                    );
                  }
                  if (option.key.__typename == "Post") {
                    return (
                      <li key={option.key.id}>
                        <Button
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            textAnchor: "left",
                          }}
                          onClick={() => {
                            navigate(`/post/${option.key.id}`);
                          }}
                        >
                          <Typography
                            textAlign={"left"}
                            sx={{ textAlign: "left", width: "100%" }}
                          >
                            {option.key.headline}
                          </Typography>
                        </Button>
                      </li>
                    );
                  }
                  if (option.key.__typename == "User") {
                    return (
                      <li key={option.key.id}>
                        <Button
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            textAnchor: "left",
                          }}
                          onClick={() => {
                            navigate(`/profile/${option.key.id}`);
                          }}
                        >
                          <Typography
                            textAlign={"left"}
                            sx={{ textAlign: "left", width: "100%" }}
                          >
                            {option.key.username}
                          </Typography>
                        </Button>
                      </li>
                    );
                  }
                }}
                renderInput={(params) => {
                  return (
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon></SearchIcon>
                      </SearchIconWrapper>
                      <StyledInputBase
                        aria-label="search"
                        variant="filled"
                        inputProps={params.inputProps}
                        ref={params.InputProps.ref}
                        onChange={(e) => {
                          debounced(e.target.value);
                        }}
                      />
                    </Search>
                  );
                }}
                renderValue={(value, getItemProps) => (
                  <Chip
                    key={value.id}
                    label={value.feedname}
                    {...getItemProps()}
                  />
                )}
              />
              <ThemeState></ThemeState>
            </Box>
          </Grid>
          <Grid
            container
            key={"appbar-right"}
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            {NotificationsState({ User })}
            {FriendsMenu({ User })}
            {Renderloginstate({ User, refetch, token })}
          </Grid>

          {NotificationState}
          {MenuState}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
