
sni <- read.csv("snijders.csv")
str(sni)

mean(sni$gpa)
mod1 <- lm(sni$gpa ~ sni$breakfast)
summary(mod1)

plot(sni$breakfast, sni$gpa, col="blue", pch=16, cex=1.3, las=1, bty="n",
	ylim=c(2,4), xlim=c(0,7), ylab="GPA", xlab="breakfast (times/week)"
)

lines(c(0,7), c(3.154923, 3.154923 - 7 * 0.003692), col="red", lwd=3) 

plot(c(6,5,7,4), c(2.77,2.69,2.96,2.75), col=colors()[12], pch=16, cex=1.3, las=1, bty="n",
	ylim=c(2,4), xlim=c(0,7), ylab="GPA", xlab="breakfast (times/week)"
)  #JAMIE

points(c(1,0,3,2), c(3.16,3.21,3.62,3.53), col=colors()[55], pch=16, cex=1.3)  #THERESE
points(c(6,5,3,4), c(3.56,3.59,2.82,2.99), col=colors()[99], pch=16, cex=1.3)  #RUSS
points(c(4,2,3,1), c(3.97,3.13,3.32,2.85), col=colors()[121], pch=16, cex=1.3) #VIRGINIA
points(c(2,4,5,3), c(2.81,3.04,3.08,2.99), col=colors()[34], pch=16, cex=1.3)  #STEPHANIE

lines(c(0,7), c(3.154923, 3.154923 - 7 * 0.003692), col="red", lwd=3) 

lines(c(0,7), c(2.409227,2.409227 + 7 * 0.07113308), col=colors()[12], lwd=0.5)  #JAMIE
lines(c(0,(4-3.112135)/0.16824872), c(3.112135,4), col=colors()[55], lwd=0.5)    #THERESE
lines(c(0,7), c(2.166087,2.166087 + 7 * 0.24077637), col=colors()[99], lwd=0.5)  #RUSS
lines(c(0,(4-2.508832)/0.32228802), c(2.508832,4), col=colors()[121], lwd=0.5)   #VIRGINIA
lines(c(0,7), c(2.616858,2.616858 + 7 * 0.10401146), col=colors()[34], lwd=0.5)  #STEPHANIE


aggregate(sni, list(sni$teacher), mean)

library(lme4)
mod2 <- lmer(gpa ~ breakfast + (breakfast | teacher), data=sni)
summary(mod2)
coef(mod2)

lines(c(0,7), c(2.56263, 2.56263 + 7 * 0.18129), lwd=3)




#LME4
library(lme4)

cheese <- read.csv("cheese.csv")
dim(cheese)
str(cheese)

hist(log(cheese$VOLUME))
hist(cheese$DISP)
hist(log(cheese$PRICE))

#LM
f <- formula(log(cheese$VOLUME) ~ cheese$DISP + log(cheese$PRICE))
mod1 <- lm(f)
summary(mod1)

x1 <- mean(cheese$DISP)
x2 <- mean(log(cheese$PRICE))
ln_pred <- 9.37119 + 0.5132 * x1 - 1.25758 * x2

hist(mod1$residuals)
qqnorm(mod1$residuals)
qqline(mod1$residuals)

#HLM
fhlm <- formula(log(VOLUME) ~ DISP + log(PRICE) + (DISP + log(PRICE) | RETAILER))
system.time(
	mod2 <- lmer(formula=fhlm, data=cheese)
)

summary(mod2)

class(mod2)
methods(class="merMod")

hist(residuals(mod2))

qqnorm(residuals(mod2))
qqline(residuals(mod2))

b <- coef(mod2)$RETAILER

plot(b$"(Intercept)", b$"log(PRICE)", bty="n", ylab="slope log(PRICE)", xlab="Intercept", cex=0.9, las=1)


plot(log(cheese$PRICE), log(cheese$VOLUME), bty="n", cex=0.9, las=1)
cor(log(cheese$PRICE), log(cheese$VOLUME))



#NULL MODEL: 
mod0 <- lmer(log(VOLUME) ~ 1 + (1 | RETAILER), data=cheese) 
dev0 <- REMLcrit(mod0)

devT <- REMLcrit(mod2)







##BAYESIAN

library(MCMCpack)
library(coda)

f_fixd <- formula(log(VOLUME) ~ DISP + log(PRICE))
f_rand <- formula(~DISP + log(PRICE))

v1 <- var(cheese$DISP)
v2 <- var(log(cheese$PRICE))

system.time(
	bayes_hlm <- MCMChregress(f_fixd, f_rand, "RETAILER", cheese,
	burnin=2000, mcmc=20000, thin=2,
	r=3, R=diag(c(1,v1,v2)))
)

plot(bayes_hlm$mcmc[,1:3])

out <- summary(bayes_hlm$mcmc)
str(out)
head(out$statistics, n=15)


##Un-center at aggregate level
t0 <- out$statistics[4:91,1] + out$statistics[1,1]
t1 <- out$statistics[92:179,1] + out$statistics[2,1]
t2 <- out$statistics[180:267,1] + out$statistics[3,1]
tB <- cbind(t0, t1, t2)

apply(tB, 2, mean)
apply(tB, 2, sd)

##Un-center original estimates
bayes_unctr <- bayes_hlm$mcmc
idx0 <- 4:91
idx1 <- idx0 + 88
idx2 <- idx1 + 88

bayes_unctr[,idx0] <- bayes_unctr[,idx0] + bayes_unctr[,1]
bayes_unctr[,idx1] <- bayes_unctr[,idx1] + bayes_unctr[,2]
bayes_unctr[,idx2] <- bayes_unctr[,idx2] + bayes_unctr[,3]

out_unctr <- summary(bayes_unctr)
head(out_unctr$statistics, n=15)

write.table(out_unctr$statistics, "out.txt", quote=FALSE, row.names=TRUE, col.names=TRUE, sep="\t")



##Plot pred vs. residuals
plot(log(cheese$VOLUME), bayes_hlm$Y.pred, xlab="ACTUAL log(VOLUME)", ylab="PREDICTED log(VOLUME)", las=1, cex=0.8)
abline(a=0,b=1, lwd=2, col="blue")

summary(lm(log(cheese$VOLUME) ~ bayes_hlm$Y.pred))

error <- log(cheese$VOLUME) - bayes_hlm$Y.pred
hist(error)
plot(log(cheese$VOLUME), error)
abline(h=0, col="blue", lwd=2)

qqnorm(error)
qqline(error, col="blue", lwd=2)

##Capture deviance
bayesD <- bayes_hlm$mcmc[,278]
str(bayesD)
mean(bayesD)


##NULL MODEL
bayes_null <- MCMChregress(log(cheese$VOLUME) ~ 1, ~1, "RETAILER", cheese, 
              burnin=2000, mcmc=20000, thin=2, 
			  r=1, R=1)
mean(bayes_null$mcmc[,92])

































