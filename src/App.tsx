import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Articles from "./Articles";
import { Link, TextField, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import { Article } from './News.interfaces';
import { debounce } from 'ts-debounce';

const drawerWidth = "50%";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    main: {
      display: 'flex',
      width: '90%',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: '2rem',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: drawerWidth,
    },
    title: {
      flexGrow: 1,
    },
    searchForm: {
      width: '100%',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
    articleContent: {
      padding: "1rem",
    }
  }),
);

const App = () => {
  // define initial state types and values
  const initialNewsStories: Article[] = [];
  const initialArticle: Article = {
    "source": "",
    "byline": "",
    "headline": "",
    "abstract": "",
    "url": "",
    "multimedia": {
      "type": "",
      "url": ""
    },
    "pub_date": "",
    "lead_paragraph": "",
  };
  const initialError: any = null;

  // use deconstrution with state hook for state variables and setters
  const [query, setQuery] = useState("crypto");
  const [article, setArticle] = useState(initialArticle);
  const [articles, setArticles] = useState(initialNewsStories);
  const [error, setError] = useState(initialError);
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  const theme = useTheme();

  /**
   * 
   * @param selectedArticle 
   */
  const handleDrawerOpen = (selectedArticle: Article) => {
    setArticle(selectedArticle);
    setOpen(true);
  };

  /**
   * 
   */
  const handleDrawerClose = () => {
    setOpen(false);
  };

  /**
   * creates a memoized function that won't trigger an update unless the param is updated
   * @param query 
   */
  const memoizedExecuteSearch = useCallback(() => {

    const executeSearch = (searchQuery: string) => {
      if (searchQuery) {
        const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchQuery}&api-key=${process.env.REACT_APP_NEWS_API_KEY}`;
        const axiosOptions: AxiosRequestConfig = {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          url,
        }
        axios.request(axiosOptions).then((response: any) => {
          if (response?.data?.response?.docs) {
            let articlesGathered: Article[] = [];
            response.data.response.docs.forEach((doc: any) => {
              let articleToGather: Article = {
                abstract: doc.abstract,
                lead_paragraph: doc.lead_paragraph,
                source: doc.source,
                byline: doc?.byline?.original,
                headline: doc?.headline?.main,
                multimedia: {
                  type: doc?.multimedia[0]?.type,
                  url: doc?.multimedia[0]?.url,
                },
                url: doc.web_url,
                pub_date: doc.pub_date,
              }
              articlesGathered.push(articleToGather);
            });
            setArticles(articlesGathered);
          }
        }).catch((err) => {
          setError(err);
        }).finally(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        });
      }
    }

    executeSearch(query);
  },
    [query],
  );



  /**
   * 
   */
  const debounceExecuteSearch = debounce(memoizedExecuteSearch, 500, { isImmediate: false });

  useEffect(() => {
    memoizedExecuteSearch();
  }, [memoizedExecuteSearch]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <form noValidate autoComplete="off" className={classes.searchForm}>
            <TextField
              fullWidth
              label="Search"
              defaultValue={query}
              variant="filled"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={() => {
                      debounceExecuteSearch();
                    }}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  // don't submit
                  ev.preventDefault();
                  // trigger onchange
                  ev.currentTarget.blur();
                  // run query with new term
                  debounceExecuteSearch();
                }
              }}
              onChange={(ev) => {
                setQuery(ev.target.value)
              }}
            />
          </form>
        </Toolbar>
      </AppBar>

      <main className={classes.main}>
        <div className={classes.drawerHeader} />
        {/* if everything worked as expected */}
        {articles && error === null && <Articles articles={articles} showFullArticle={handleDrawerOpen}></Articles>}
        {/* if there is an error with the service */}
        {error !== null && <div>Service is not available. Please try again later.</div>}
      </main>

      <Drawer
        className={classes.drawer}
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <Typography variant="body1" className={classes.articleContent}>
          {article.lead_paragraph}&nbsp;&nbsp;
          <Link href={article.url} target="_blank" rel="noopener">
            Continue Reading Original Article &gt;
          </Link>
        </Typography>
      </Drawer>
    </div>
  );
}

export default App;
