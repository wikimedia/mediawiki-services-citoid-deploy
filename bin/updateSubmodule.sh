#!/usr/bin/env bash

# This script generates a commit that updates the citoid submodule
# updateSubmodule.sh        updates to master
# updateSubmodule.sh hash   updates to specified hash

cd $(dirname $0)/..;

# Check that both working directories are clean
if git status -uno --ignore-submodules | grep -i changes > /dev/null
then
	echo >&2 "deploy directory must be clean"
	exit 1
fi
cd src
if git status -uno --ignore-submodules | grep -i changes > /dev/null
then
	echo >&2 "src working directory must be clean"
	exit 1
fi
cd ..

git fetch origin
# Create sync-repos branch if needed and reset it to master
git checkout -B sync-repos origin/master
git submodule update
cd src
git fetch origin
# inspect what has changed
flist=$(git diff --name-only origin/master);

# Figure out what to set the submodule to
if [ "x$1" != "x" ]
then
	TARGET="$1"
	TARGETDESC="$1"
else
	TARGET=origin/master
	TARGETDESC="master ($(git rev-parse --short origin/master))"
fi

# Generate commit summary
NEWCHANGES=$(git log ..$TARGET --oneline --no-merges --reverse --color=never)
NEWCHANGESDISPLAY=$(git log ..$TARGET --oneline --no-merges --reverse --color=always)
COMMITMSG=$(cat <<END
Update citoid submodule to $TARGETDESC

New changes:
$NEWCHANGES
END
)
# Check out master citoid
git checkout $TARGET

# rebuild the modules if package.json has changed
cd ..
if echo -e "${flist}" | grep -i package.json > /dev/null; then
	git rm node_modules;
	rm -rf node_modules;
	npm install;
	find node_modules/ -iname '.git*' -exec rm -rf {} \;
	git add node_modules;
fi

# Commit
git add src;
git commit -m "$COMMITMSG" > /dev/null
if [ "$?" == "1" ]
then
	echo >&2 "No changes"
else
	cat >&2 <<END


Created commit with changes:
$NEWCHANGESDISPLAY
END
fi
